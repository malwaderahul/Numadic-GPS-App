#!/bin/sh
set -e


rm -f index.*
rm -f serial.*
rm -f *.pem
touch index.txt
echo '01' > serial.txt


