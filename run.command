#!/bin/bash
cd "$(dirname "$0")"
open file://$PWD/index.html
cd apiclip
python3 api.py