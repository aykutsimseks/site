import sys, os, re
from bs4 import BeautifulSoup
from HTMLParser import HTMLParser
import urllib2
import time, stat
from random import betavariate
import datetime
import gzip,json
import unicodecsv as csv 
import shutil

from netflix_scraper import Netflix
from simseks import *

reload(sys)  
sys.setdefaultencoding('utf8')


# http://www.imdb.com/movies-coming-soon/2015-05
url_base = 'http://www.imdb.com/movies-coming-soon'

start = [2011,1]
end   = [int(datetime.datetime.now().strftime("%Y")),int(datetime.datetime.now().strftime("%m"))]


pwd = os.path.dirname(os.path.realpath(__file__))
netflix = Netflix()
    
sleep_time=10;

####


def parse_imdb_html(content, current, max_age=False):
    outdir	= "%s/download/imdb_html_parsed" % (pwd)
    file_handle = "%d-%s" 	% (current[0],str(current[1]).zfill(2))
    filepath 	= "%s/%s.csv"	% (outdir,file_handle)
    
    if max_age and os.path.exists(filepath):
	file_age = file_age_in_seconds(filepath) - time.time()/1000
    else:
	file_age = -1
	max_age  = 0
    
    movie_list 	= []
    
    if not os.path.exists(outdir):
        os.makedirs(outdir);
    
    if file_age > max_age or not os.path.exists(filepath):
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
		actors = [ g.text.encode('utf-8').strip() for g in html_scraper(movie,[['other','span', 'itemprop','actors']])]
	    except:
		actors = ''
    
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
		'rating'	: '',
		'metascore'	: metascore,
		'month' 	: str(current[1]),
		'year' 		: str(current[0]),
		'description'	: description,
		'director'  	: director,
		'actors'	: actors,
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

def parse_imdb_html_omdb(content, current, max_age=False):
    outdir	= "%s/download/imdb_html_parsed_omdb" % (pwd)
    file_handle = "%d-%s" 	% (current[0],str(current[1]).zfill(2))
    filepath 	= "%s/%s.csv"	% (outdir,file_handle)
    
    if max_age and os.path.exists(filepath):
	file_age = file_age_in_seconds(filepath) - time.time()/1000
    else:
	file_age = -1
	max_age  = 0
    
    movie_list 	= []
    
    if not os.path.exists(outdir):
        os.makedirs(outdir);
    
    if file_age > max_age or not os.path.exists(filepath):
	print("Parsing page into: " + file_handle);
	soup   = BeautifulSoup(content, "html.parser")
	movies = html_scraper(soup,[['tag_class','td','overview-top']])
	images = html_scraper(soup,[['other','td','id', 'img_primary']])
	for idx, movie in enumerate(movies):
	    try:
		name  = html_scraper(movie,[['other','h4', 'itemprop','name'],['tag','a']])[0]
		url   = 'http://www.imdb.com' + name.get('href').split('?')[0]
		unique_id = url.split('/')[-2];
		omdb_file_path = 'download/omdb_json/%s.json'%(unique_id)
		omdb_url  = "http://www.omdbapi.com/?i=%s&tomatoes=true"%(unique_id)
		omdb_json = json.loads(get_url_content(omdb_url,unique_id, loc='download/omdb_json', ext='json', s=1))
		title 	  = "%s (%s)"%(omdb_json.get('Title'),omdb_json.get('Year'))
		try:
		    omdb_json['netflixID'] = netflix.isNetflix(title).get('id')
		except:
		    omdb_json['netflixID'] = ''
		    
		with open(omdb_file_path, 'wb') as content_file:
		    content_file.write(json.dumps(omdb_json, indent=4))
	    except:
		print "Failed Parsing"
    
	    
	    
	with open(filepath, 'wb') as json_file:
	    json_file.write(json.dumps(movie_list, indent=4))
    else:
	with open(filepath, "rb") as json_file:
            movie_list += json.load(json_file)
    
    return movie_list
    return

def generate_movie_list():
    current 	= start;
    movie_list 	= []
    
    # Get weekly coming soon pages
    while date_as_int(current) <= date_as_int(end):
	file_handle = "%d-%s"%(current[0],str(current[1]).zfill(2))
	print file_handle
	url = url_base + '/' + file_handle
	# Re-download and parse last 2 months data as they might update
	#refresh_last 	 = 0
	#force_refresh 	 = date_as_int(current) > (date_as_int(end) - refresh_last)
	content 	 = get_url_content(url,file_handle, loc="download/imdb_html", max_age=week_seconds)
	# Parse
	soup = BeautifulSoup(content, "html.parser")
	movies = html_scraper(soup,[['other', 'div', 'itemtype','http://schema.org/Movie']])
	for idx, movie in enumerate(movies):
	    try:
		link  = html_scraper(movie,[['other','a', 'itemprop','url']])[0]
		unique_id = link.get('href').split('?')[0].split('/')[-2]
		movie_list.append({'unique_id': unique_id, 'date' : [current[0],current[1]]});
	    except:
	    	None;
	if current[1] == 12:
	    current[0] = current[0]+1; 
	current[1] = (current[1]%12)+1;

    return movie_list

def movie_content(movie_id, max_age = False):
    # Get main content from omdb
    omdb_url  = "http://www.omdbapi.com/?i=%s&tomatoes=true"%(movie_id)
    
    def additional_operations(contents):
	if not contents:
	    return {}
	contents = json.loads(contents)
	# Image
	try:
	    image_url = contents.get('Poster')
	    if image_url:
	        image_url = image_url.replace('_SX300','_UY120')
	        get_url_content(image_url,movie_id, loc='download/imdb_thumbnails', ext='png', s=1)
	except:
	    None
	    
	#Netflix
	title = "%s (%s)"%(contents.get('Title'),contents.get('Year'))
	
	netflix_json = netflix.isNetflix(title)
	if netflix_json:
	    contents['netflixID'] 		= netflix_json.get('id')
	    contents['netflixRating'] 		= netflix_json.get('rating')
	    contents['netflixAvailable']	= netflix_json.get('available')
	    
	return json.dumps(contents, indent=4, sort_keys=True)
    omdb_json = json.loads(get_url_content(omdb_url,movie_id, loc='download/movie_json', ext='json', s=1, max_age=max_age, action=additional_operations, force_action=True))
    return omdb_json
    
	
def main():
    print "***** Generating Movie List"
    movie_list = {v['unique_id']:v for v in generate_movie_list()}.values();
    
    
    print "***** Gathering Movie Data"
    i=1
    for movie in movie_list:
	factor = ((date_as_int(end) - date_as_int(movie.get('date')) + 1))
	print str(i).rjust(5) + "/" + str(len(movie_list)) + " | " + '-'.join(str(v).ljust(4) for v in movie.get('date')) + " | " + str(factor).ljust(2) + " months ago"
	#print factor
    	movie_content(movie.get('unique_id'), max_age = factor * week_seconds / 4)
	i+=1
    
    print "***** Generating movies.csv"
    with open(pwd + "/data/movies.csv", "w") as csvfile:
	header = ["Title",
		  "imdbID",
		  "Year",
		  "Released",
		  "Runtime",
		  "Genre",
		  "Director",
		  "Actors",
		  "Plot",
		  "Metascore",
		  "imdbRating",
		  "tomatoRating",
		  "netflixRating",
		  "netflixID"
	]
	writer = csv.DictWriter(csvfile, fieldnames=header)
	writer.writeheader()
	
	for movie_id in movie_list:
	    json_file = '%s/download/movie_json/%s.json'%(pwd,movie_id.get('unique_id'))
	    with open(json_file, "rb") as json_file:
		jsonobj = json.load(json_file)
		row = { k: (jsonobj.get(k) or '') for k in header }
		writer.writerow(row)
	    
    # Gzip csv file
    with open(pwd + "/data/movies.csv", 'rb') as f_in, gzip.open(pwd + "/data/movies.csv.gz", 'wb') as f_out:
	shutil.copyfileobj(f_in, f_out)
 
if __name__ == "__main__":
    main()
   