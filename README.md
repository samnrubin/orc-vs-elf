<p align="center">
  <img width="800" alt="Orc vs Elf main page" src="https://user-images.githubusercontent.com/1661192/214467561-8d2477e9-1f60-48a6-b88a-25e2e67723f5.png">
</p>

This is a game project I built along with @mmxmb for the Jan 21st Scale AI Hackathon. We ran into issues with the frontend during the end, so were unable to finish with a working product but I went ahead and fixed the game up post hackathon.

Our idea was to make a dynamic combat game that takes place on Market St. in San Francisco – each turn GPT3 generates potential moves for the Orc and the Elf which players can select. When moves are selected GPT3 will then evaluate each move and determine if that move should successful, then will generate the content of the next move. When a move is successful, the defending player will lose 1 heart worth of HP.

Run the app by first exporting your OpenAI key:

`export OPENAI_API_KEY=<YOUR KEY>`

Then from the backend directory run

`uvicorn main:app --host 0.0.0.0`

Then in the frontend directory run

`npm start`

Make sure you have installed all dependencies first.

<b>Beware: this is very much a hack.</b> You will need to restart both the backend and frontend to start a new game and the frontend and we did not have time to finish the game ending code, so text content nor the frontend will not acknowledge when a combatant defeats the other.
