#!/bin/bash

if [ "$#" -ne 2 ]; then
  echo Usage: $0 '<source directory> <dest directory>'
  exit 1
fi

source="$1"
dest="$2"

for file in $1/*.pdf; do
  # echo $file `basename $file`
  base=`basename $file`
  gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=$dest/$base $file
done



