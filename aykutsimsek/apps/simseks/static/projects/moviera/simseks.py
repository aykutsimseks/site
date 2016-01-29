import sys, os, re
import time, datetime, stat
import urllib2
from bs4 import BeautifulSoup,NavigableString
from HTMLParser import HTMLParser
from random import betavariate

import shutil

reload(sys)  
sys.setdefaultencoding('utf8')

month_seconds       = 2628000 
week_seconds        =  604800

default_sleep_time  = 10

pwd = os.path.dirname(os.path.realpath(__file__))


def file_age_in_seconds(pathname):
    return time.time() - os.stat(pathname)[stat.ST_MTIME]

def randomsleep(t):
    'Sleep between zero and t seconds.'
    time.sleep(t * betavariate(0.7, 8))
    
def mk_int(s):
    try:
        s = re.search(r'\d+',s).group()
        return int(s) if s else 0
    except:
	return ''
    
def date_as_int(array):
    #[%Y, %m]
    return array[0]*12 + array[1]

def json_array_fields_as_str(d):
    for k, v in d.items():
	# catch None's
	if v is not None:
	    d[k] = ",".join(v).encode("utf-8") if isinstance(v, list) else v.encode("utf-8")

def gzip_file(pwd, filepath):
    # Gzip file
    with open(pwd + filepath, 'rb') as f_in, gzip.open(pwd + filepath + ".gz", 'wb') as f_out:
	shutil.copyfileobj(f_in, f_out)

def html_scraper(soup,matcher):
    content = ''
    for i in matcher:
        if i[0] == 'id':
            content = soup.findAll(id=i[1])
	    soup = content[0]
        elif i[0] == 'tag':
            content = soup.findAll(i[1])
	elif i[0] == 'tag_class':
            content = soup.findAll(i[1], { "class" : i[2] })
	elif i[0] == 'other':
            content = soup.findAll(i[1], { i[2] : i[3] })
    return content

def html_stripper(soup,strip_tags):
    for i in strip_tags:
        element = []
        if i[0] == 'id':
            element = soup.findAll(id=i[1])
        elif i[0] == 'tag':
            element = soup.findAll(i[1])
        elif i[0] == 'tag_class':
            element = soup.findAll(i[1], { "class" : i[2] })
	elif i[0] == 'free_form':
            element = soup.findAll(i[1], { i[2] : i[3] })
        for e in element:
            e.extract()
    return soup

def get_url_content(url, page_id, loc='download', ext='html', s=default_sleep_time, max_age=0, force_action=False, action=None):
    outdir	= pwd 	  + "/" + loc
    filepath 	= outdir  + "/" + page_id + '.' + ext
    
    if not os.path.exists(outdir):
        os.makedirs(outdir);
    
    if max_age and os.path.exists(filepath):
	file_age = file_age_in_seconds(filepath) - time.time()/1000
    else:
	file_age = -1
	max_age  =  0

    if file_age > max_age or not os.path.exists(filepath):
	print("Downloading page.....: " + url);
	try:
            contents = urllib2.urlopen(url).read()
            if action:
                contents = action(contents)
            with open(filepath, 'wb') as content_file:
                content_file.write(contents)
                randomsleep(default_sleep_time)
	    
	except:
	    print "ERROR retrieving content from: %s"%(url)

    content = open(filepath, 'r').read();
    if force_action:
	content = action(content)
    return content
