## Developing locally

Clone the repo and run the following commands in the root of the project

- `npm ci`
- `npm run build`
- `npm start`

You can then load cartridges by running `load <cartridge_name>`

If you want to run multiple commands sequentially within a cartridge, use the following command: `dev <command_1>; <command_2>` (e.g `dev look at cabinet; open drawer; take key; use key on door; open door;`)

## Using the engine

Please see the full TextAdventure.js engine documentation [here](doc/text-adventure.md)
