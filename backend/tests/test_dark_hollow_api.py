"""Backend tests for Dark Hollow API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://slash-platform.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Health check
class TestHealth:
    def test_root_health(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "Dark Hollow" in data["message"]


# Game config
class TestGameConfig:
    def test_get_config(self, client):
        r = client.get(f"{API}/game/config", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("version")
        assert data.get("game_name") == "Dark Hollow"
        assert isinstance(data["version"], str)


# Save / Load game
class TestSaveLoad:
    SLOT = 999  # use high slot to avoid colliding with real saves

    def test_save_game(self, client):
        payload = {
            "slot": self.SLOT,
            "player_data": {"health": 80, "score": 1234, "level": 2, "TEST": True},
        }
        r = client.post(f"{API}/game/save", json=payload, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["slot"] == self.SLOT
        assert data["player_data"]["score"] == 1234
        assert data["player_data"]["TEST"] is True
        assert "id" in data
        assert "timestamp" in data

    def test_load_game_returns_persisted_data(self, client):
        r = client.get(f"{API}/game/load/{self.SLOT}", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "error" not in data
        assert data["slot"] == self.SLOT
        assert data["player_data"]["score"] == 1234
        assert data["player_data"]["TEST"] is True
        # _id from mongo should not leak
        assert "_id" not in data

    def test_save_overwrites_same_slot(self, client):
        payload = {
            "slot": self.SLOT,
            "player_data": {"health": 50, "score": 9999, "TEST": True},
        }
        r = client.post(f"{API}/game/save", json=payload, timeout=15)
        assert r.status_code == 200

        r2 = client.get(f"{API}/game/load/{self.SLOT}", timeout=15)
        assert r2.status_code == 200
        assert r2.json()["player_data"]["score"] == 9999

    def test_get_all_saves(self, client):
        r = client.get(f"{API}/game/saves", timeout=15)
        assert r.status_code == 200
        saves = r.json()
        assert isinstance(saves, list)
        # ensure no _id leak
        for s in saves:
            assert "_id" not in s
        # our test slot should be present
        slots = [s["slot"] for s in saves]
        assert self.SLOT in slots

    def test_load_nonexistent_slot(self, client):
        r = client.get(f"{API}/game/load/12345", timeout=15)
        # Endpoint returns 200 with error message body when not found
        assert r.status_code == 200
        data = r.json()
        assert "error" in data
        assert data["slot"] == 12345


# CORS sanity
class TestCors:
    def test_cors_header_present(self, client):
        r = client.get(
            f"{API}/",
            headers={"Origin": "https://example.com"},
            timeout=15,
        )
        assert r.status_code == 200
        # FastAPI CORS middleware echoes when wildcard is configured
        assert (
            r.headers.get("access-control-allow-origin") in ("*", "https://example.com")
        )
