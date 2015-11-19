import sys, os, re
from bs4 import BeautifulSoup,NavigableString
from HTMLParser import HTMLParser
import urllib2
import time
from random import betavariate
import datetime
import gzip,json
import unicodecsv as csv 
import shutil
from netflix_scraper import Netflix

reload(sys)  
sys.setdefaultencoding('utf8')


# http://www.imdb.com/movies-coming-soon/2015-05
url_base = 'http://www.imdb.com/movies-coming-soon'

start = [2011,1]
end   = [int(datetime.datetime.now().strftime("%Y")),int(datetime.datetime.now().strftime("%m"))]


pwd = os.path.dirname(os.path.realpath(__file__))
netflix = Netflix()

### GENERICS
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
	    
sleep_time=10;
    
def get_url_content(url,page_id, loc='download', ext='html', s=sleep_time, force_refresh=False):
    outdir	= pwd 	  + "/" + loc
    filepath 	= outdir  + "/" + page_id + '.' + ext
    
    if not os.path.exists(outdir):
        os.makedirs(outdir);
        
    if force_refresh or not os.path.exists(filepath):
        print("Downloading page.....: " + url);
	try:
	    contents = urllib2.urlopen(url).read()
	    with open(filepath, 'wb') as content_file:
	        content_file.write(contents)
		randomsleep(sleep_time)
	except:
	    print "ERROR!!!"
	    return ""
    content = open(filepath, 'r').read();
    return content

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

####


def parse_imdb_html(content, current, force_refresh=False):
    outdir	= "%s/download/imdb_html_parsed" % (pwd)
    file_handle = "%d-%s" 	% (current[0],str(current[1]).zfill(2))
    filepath 	= "%s/%s.csv"	% (outdir,file_handle)
    
    movie_list 	= []
    
    if not os.path.exists(outdir):
        os.makedirs(outdir);
    
    if force_refresh or not os.path.exists(filepath):
	print("Parsing page into: " + file_handle);
	soup = BeautifulSoup(content, "html.parser")
	movies = html_scraper(soup,[['tag_class','td','overview-top']])
	images = html_scraper(soup,[['other','td','id', 'img_primary']])
	for idx, movie in enumerate(movies):
	    try:
		name  = html_scraper(movie,[['other','h4', 'itemprop','name'],['tag','a']])[0]
		url   = 'http://www.imdb.com' + name.get('href').split('?')[0]
		unique_id = url.split('/')[-2];
		title = name.text.encode('utf-8').strip()
	    except:
		title     = ''
		url    	  = ''
    
	    try:
		description = html_scraper(movie,[['other','div', 'itemprop','description']])[0].text.encode('utf-8').strip()
	    except:
		description  = ''
		    
	    try:
		director = html_scraper(movie,[['other','span', 'itemprop','director']])[0].text.encode('utf-8').strip()
	    except:
		director  = ''
		
	    try:
		stars = [ g.text.encode('utf-8').strip() for g in html_scraper(movie,[['other','span', 'itemprop','actors']])]
	    except:
		stars = ''
    
	    try:
		run_time   = html_scraper(movie,[['other','time', 'itemprop','duration']])[0].text.encode('utf-8').strip().split(' min')[0]
	    except:
		run_time  = ''
		
	    try:
		genres = [ g.text.encode('utf-8').strip() for g in html_scraper(movie,[['other','span', 'itemprop','genre']])]
	    except:
		genres  = ''
		
	    try:
		metascore = html_scraper(movie,[['tag_class','div','metascore'],['tag','strong']])[0].text.encode('utf-8').strip()
	    except:
		metascore  = ''
		    
		    
	    try:
		image_url = html_scraper(images[idx],[['other','img', 'itemprop','image']])[0].get('src').split('?')[0]
		get_url_content(image_url,unique_id, loc='download/imdb_thumbnails', ext='png', s=1)
	    except:
		image_url = ''
		    
	    try:
		netflix_id = netflix.isNetflix(title).get('id')
	    except:
		netflix_id = ''
		    
	    movie_json = {
		'title'		: title,
		#'url'		: url,
		'unique_id'	: unique_id,
		'run_time'	: run_time,
		'genres'	: genres,
		'metascore'	: metascore,
		'month' 	: str(current[1]),
		'year' 		: str(current[0]),
		'description'	: description,
		'director'  	: director,
		'stars'	    	: stars,
		#'image_url' 	: image_url,
		'netflix_id' 	: netflix_id
	    }
	    movie_list.append(movie_json)
	    
	with open(filepath, 'wb') as json_file:
	    json_file.write(json.dumps(movie_list, indent=4))
    else:
	with open(filepath, "rb") as json_file:
            movie_list += json.load(json_file)
    
    return movie_list


def main():
    current = start;
    movie_list = []
    while date_as_int(current) <= date_as_int(end):
	file_handle = "%d-%s"%(current[0],str(current[1]).zfill(2))
	print file_handle
	url = url_base + '/' + file_handle
	# Re-download and parse last 2 months data as they might update
	force_refresh 	 = date_as_int(current) > (date_as_int(end) - 2)
        content 	 = get_url_content(url,file_handle, loc="download/imdb_html", force_refresh= force_refresh)
	movie_list 	+= parse_imdb_html(content, current, force_refresh= force_refresh)
        if current[1] == 12:
	    current[0] = current[0]+1;
	    
	current[1] = (current[1]%12)+1;
	
    # Write to csv
    with open(pwd + "/data/movies.csv", "w") as csvfile:
	header = ["title",
		#"url",
		"unique_id",
		"run_time",
		"metascore",
		"genres",
		"month",
		"year",
		"description",
		"director",
		"stars",
		#"image_url",
		"netflix_id"]
	writer = csv.DictWriter(csvfile, fieldnames=header)
	writer.writeheader()
	# get each dict from the list
	for d in movie_list:
	    # run the encode func
	    json_array_fields_as_str(d)
	    writer.writerow(d)
    
    # Gzip csv file
    with open(pwd + "/data/movies.csv", 'rb') as f_in, gzip.open(pwd + "/data/movies.csv.gz", 'wb') as f_out:
	shutil.copyfileobj(f_in, f_out)
    
if __name__ == "__main__":
    main()
   