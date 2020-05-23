#!/bin/bash
cd "$(dirname "$0")"
python scan.py filedir.json.js
open file://$PWD/index.html