#!/bin/bash
export WORKON_HOME=~/Envs
mkdir -p $WORKON_HOME
source /usr/local/bin/virtualenvwrapper.sh
workon aykutsimsek
python manage.py runserver
