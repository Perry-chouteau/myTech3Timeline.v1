#!/usr/bin/env bash

awk '
function replace_start(line) {
    match(line, /(start|end)\(([0-9]+), ([0-9]+), ([0-9]+)\)/, arr)
    replacement = "\"" arr[4] "-" arr[3] "-" arr[2] "\""
    return substr(line, 0, RSTART - 1) replacement substr(line, RSTART + RLENGTH)
}

/start/ {
    line = replace_start($0)
    line = replace_start(line)
    print line
}
!/start|now/
' | sed -e "s/'/\"/g" -e "s/\\\\\"/'/g" | jq '
{
    promo: 0,
    semester: 0,
    projects: map({
        module: .[0],
        project: .[1],
        start: .[2],
        end: .[3],
        bttf: .[1] | [contains("Back"),contains("BTTF")] | any
    })
}
'
