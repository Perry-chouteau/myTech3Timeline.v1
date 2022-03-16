# Epitech Timeline

## Testing

### Static

You need to symlink `data.json` to any of the datasets in `/data`. For example :

``` sh
ln -s data/timeline-2023.json data.json
```

If you have Python 3, you can start a static server locally on port 8000 :

``` sh
python3 -m http.server
```

### Nginx

Include the file `timeline.conf` in your nginx server config, and set the
variable `$timeline_path` to the absolute path of the repository.

``` nginx
set $timeline_path /path/to/timeline;
include $timeline_path/timeline.conf;
```

The timeline will be available from the `/$promo/timeline` route, and the data
from the `/$promo/timeline/data.json`, where `$promo` is the promotion name of
one of the datasets.

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
