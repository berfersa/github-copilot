import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "Tennis Club" in data
    assert "participants" in data["Tennis Club"]

def test_signup_and_unregister():
    # Signup
    email = "testuser@mergington.edu"
    activity = "Tennis Club"
    signup_resp = client.post(f"/activities/{activity}/signup?email={email}")
    assert signup_resp.status_code == 200 or signup_resp.status_code == 400
    # Unregister
    unregister_resp = client.post(f"/activities/{activity}/unregister?email={email}")
    assert unregister_resp.status_code == 200 or unregister_resp.status_code == 400

def test_signup_duplicate():
    email = "alex@mergington.edu"
    activity = "Tennis Club"
    resp = client.post(f"/activities/{activity}/signup?email={email}")
    assert resp.status_code == 400
    assert "already signed up" in resp.json().get("detail", "")

def test_unregister_not_registered():
    email = "notregistered@mergington.edu"
    activity = "Tennis Club"
    resp = client.post(f"/activities/{activity}/unregister?email={email}")
    assert resp.status_code == 400
    assert "not registered" in resp.json().get("detail", "")
