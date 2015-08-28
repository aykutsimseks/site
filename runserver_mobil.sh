#!/bin/bash
export WORKON_HOME=~/Envs
mkdir -p $WORKON_HOME
source /usr/local/bin/virtualenvwrapper.sh
workon aykutsimsek
python manage.py runserver 192.168.1.42:8000
