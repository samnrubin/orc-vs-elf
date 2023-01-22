curl -s localhost:8000/game_state | jq
curl -H "Content-Type: application/json" -d "{\"player\": \"orc\", \"action\": 1}" localhost:8000/take_action | jq
curl -H "Content-Type: application/json" -d "{\"player\": \"elf\", \"action\": 2}" localhost:8000/take_action | jq
