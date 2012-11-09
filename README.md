npm-dir_count
================

metrics and checks for checking the number of files in a directory in nodejs output to graphite format for use via sensu or nagios


To get metrics output do `bin/dir_count.js -m -s SCHEME_NAME -p PATH` where SCHEME_NAME matches the prefix required by your system for graphite and PATH is the full path to the directory you want checked. If you want to exclude certain files then add '-e EXCLUDE' where EXCLUDE matches a filename of part of a file name you want excluded.

For Alert based checks you need to set both the critical and warning flags '-c' & '-w' instead of the metric flag '-m' to the levels at which you want the alerts raised.


