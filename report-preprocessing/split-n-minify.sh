#!/bin/bash

if [ "$#" -ne 2 ]; then
  echo Usage: $0 '<source file> <dest directory>'
  exit 1
fi

source="$1"
dest="$2"

if [ ! -f "$source" ]; then
  echo "Source file does not exist"
  exit 2
fi

# create intermediate temp directory
TEMP_DIR=`mktemp -d`


function cleanup {
  rm -rf $TEMP_DIR
}

trap cleanup EXIT

# check if tmp dir was created
if [[ ! "$TEMP_DIR" || ! -d "$TEMP_DIR" ]]; then
  echo "Could not create temp dir"
  exit 3
fi

# split the source file into 10 page chunks
echo Start spliting $source into 10 page chunks
cpdf "$source" -split -chunk 10 -o $TEMP_DIR/%%%.pdf


# minify each file
mkdir -p $dest

echo Start minifying files
for file in $TEMP_DIR/*.pdf; do
  base=`basename $file`

  gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile="$dest/$base" $file
done
