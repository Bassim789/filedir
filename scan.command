#!/bin/bash
cd "$(dirname "$0")"
python scan.py ~
open file://$PWD/index.html