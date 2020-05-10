#!/bin/bash
cd "$(dirname "$0")"
python scan.py filedir.txt
open file://$PWD/index.html