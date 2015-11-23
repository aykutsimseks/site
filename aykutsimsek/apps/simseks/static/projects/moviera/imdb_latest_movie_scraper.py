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
import glob
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
    
def get_url_content(url,page_id, loc='download', ext='html', s=sleep_time, force_refresh=False, action=None):
    outdir	= pwd 	  + "/" + loc
    filepath 	= outdir  + "/" + page_id + '.' + ext
    
    if not os.path.exists(outdir):
        os.makedirs(outdir);
        
    if force_refresh or not os.path.exists(filepath):
        print("Downloading page.....: " + url);
	#try:
	contents = urllib2.urlopen(url).read()
	if action:
	    contents = action(contents)
	with open(filepath, 'wb') as content_file:
	    content_file.write(contents)
	    randomsleep(sleep_time)
	    
	#except:
	#    print "ERROR!!!"
	#    return ""
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

def parse_imdb_html_omdb(content, current, force_refresh=False):
    outdir	= "%s/download/imdb_html_parsed_omdb" % (pwd)
    file_handle = "%d-%s" 	% (current[0],str(current[1]).zfill(2))
    filepath 	= "%s/%s.csv"	% (outdir,file_handle)
    
    movie_list 	= []
    
    if not os.path.exists(outdir):
        os.makedirs(outdir);
    
    if force_refresh or not os.path.exists(filepath):
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

def main_bk():
    current = start;
    movie_list = []
    while date_as_int(current) <= date_as_int(end):
	file_handle = "%d-%s"%(current[0],str(current[1]).zfill(2))
	print file_handle
	url = url_base + '/' + file_handle
	# Re-download and parse last 2 months data as they might update
	refresh_last = 250
	force_refresh 	 = date_as_int(current) > (date_as_int(end) - refresh_last)
	content 	 = get_url_content(url,file_handle, loc="download/imdb_html", force_refresh= force_refresh)
	
	#movie_list 	+= parse_imdb_html(content, current, force_refresh= force_refresh)
	movie_list 	+= parse_imdb_html_omdb(content, current, force_refresh= force_refresh)
	
        if current[1] == 12:
	    current[0] = current[0]+1;
	    
	current[1] = (current[1]%12)+1;
	
    # Write to csv
    '''
    with open(pwd + "/data/movies.csv", "w") as csvfile:
	unique_ids    = []
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
		"actors",
		#"image_url",
		"netflix_id"]
	writer = csv.DictWriter(csvfile, fieldnames=header)
	writer.writeheader()
	# get each dict from the list
	for d in movie_list:
	    # run the encode func
	    if d['unique_id'] not in unique_ids:
		unique_ids.append(d['unique_id'])
		json_array_fields_as_str(d)
		writer.writerow(d)
    '''
    with open(pwd + "/data/movies.csv", "w") as csvfile:
	unique_ids    	= []
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
		  "netflixID"
	]
	writer = csv.DictWriter(csvfile, fieldnames=header)
	writer.writeheader()
	read_files 	= glob.glob(pwd + "/download/omdb_json/*.json")

	for f in read_files:
	    with open(f, "rb") as infile:
		d = json.loads(infile)
		for d in movie_list:
		    if d['imdbID'] not in unique_ids:
		        unique_ids.append(d['imdbID'])
		        writer.writerow(d)
	    
    # Gzip csv file
    with open(pwd + "/data/movies.csv", 'rb') as f_in, gzip.open(pwd + "/data/movies.csv.gz", 'wb') as f_out:
	shutil.copyfileobj(f_in, f_out)


def generate_movie_list():
    current 	= start;
    movie_list 	= []
    
    # Get weekly coming soon pages
    while date_as_int(current) <= date_as_int(end):
	file_handle = "%d-%s"%(current[0],str(current[1]).zfill(2))
	print file_handle
	url = url_base + '/' + file_handle
	# Re-download and parse last 2 months data as they might update
	refresh_last 	 = 0
	force_refresh 	 = date_as_int(current) > (date_as_int(end) - refresh_last)
	content 	 = get_url_content(url,file_handle, loc="download/imdb_html", force_refresh= force_refresh)
	# Parse
	soup = BeautifulSoup(content, "html.parser")
	movies = html_scraper(soup,[['other', 'div', 'itemtype','http://schema.org/Movie']])
	for idx, movie in enumerate(movies):
	    try:
		link  = html_scraper(movie,[['other','a', 'itemprop','url']])[0]
		unique_id = link.get('href').split('?')[0].split('/')[-2]
		movie_list.append(unique_id);
	    except:
	    	None;
	if current[1] == 12:
	    current[0] = current[0]+1; 
	current[1] = (current[1]%12)+1;

    return movie_list

def movie_content(movie_id):
    # Get main content from omdb
    omdb_url  = "http://www.omdbapi.com/?i=%s&tomatoes=true"%(movie_id)
    
    def additional_operations(contents):
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
	
    omdb_json = json.loads(get_url_content(omdb_url,movie_id, loc='download/movie_json', ext='json', s=1, action=additional_operations))
    return omdb_json
    
	
def main():
    movie_list = list(set(generate_movie_list()));
    
    for movie_id in movie_list:
    	movie_content(movie_id)
    
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
	    json_file = 'download/movie_json/%s.json'%(movie_id)
	    with open(json_file, "rb") as json_file:
		jsonobj = json.load(json_file)
		row = { k: (jsonobj.get(k) or '') for k in header }
		writer.writerow(row)
	    
    # Gzip csv file
    with open(pwd + "/data/movies.csv", 'rb') as f_in, gzip.open(pwd + "/data/movies.csv.gz", 'wb') as f_out:
	shutil.copyfileobj(f_in, f_out)
 
if __name__ == "__main__":
    main()
   