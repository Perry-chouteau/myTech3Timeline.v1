# Epitech Timeline

## Edition

You need to symlink `data.json` to any of the datasets in `/data`. For example :

``` sh
ln -s data/timeline-2025.json data.json
```

## Data format

The format of the timeline data is a JSON object with the following keys:
- `promo`: The name of the promo associated with the data
- `semester`: The number of the semester associated with the data
- `projects`: An array of all the projects of the semester.

A project is a JSON object with the following keys:

- `module`: Name of the module
- `project`: Name of the project
- `start`: Date of the start of the project
- `end`: Date of the end of the project
- `bttf`: Optional boolean specifying if the project is a BTTF
