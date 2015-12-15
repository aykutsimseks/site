import sys, glob, os, re
import time
from random import betavariate
import datetime
import gzip,json
from requests import Request, Session


from fuzzywuzzy import fuzz
import codecs

reload(sys)  
sys.setdefaultencoding('utf8')

force_refresh = True
#force_refresh = False

class Netflix():
    def __init__(self):
	txt_file = pwd + '/data/netflix.json'
	with codecs.open(txt_file, 'r', encoding='utf-8') as json_file:
	    self.netflix_json = json.loads(json_file.read())
    
    # Search title ex. Reservoir Dogs ()
    def isNetflix(self, search_title):
	netflix_json = self.netflix_json;
        for num in range(0,len(netflix_json)):
	    title = netflix_json[num]["title"] + " (" + netflix_json[num]["year"] + ")"
    
	    #cleaning unicode
	    title = title.encode('ascii','ignore')
	    title = title.decode('utf-8')

	    title_string = str(title).replace('\xa0','').replace('\u200b','')

	    if fuzz.ratio(title_string.lower().strip(),search_title.lower().strip()) >= 97:
	        return netflix_json[num]
	return None

def randomsleep(t):
    'Sleep between zero and t seconds.'
    time.sleep(t * betavariate(0.7, 8))

sleep_time=100;
output_directory = "download/allflicks"
pwd = os.path.dirname(os.path.realpath(__file__))

url_base = 'http://www.allflicks.net/wp-content/themes/responsive/processing/processing_us.php'

def run_scraper():
    _session = Session()
    
    params = {
	'draw' 		: 2,
	'columns[0][data]': 	'available',
	'columns[0][seachable]': 	'true',
	'columns[0][orderable]': 	'true',
	'columns[0][search][regex]': 	'false',
	'order[0][column]'   	:  0,
	'order[0][dir]'	: 'asc',
	'length'  	: 100,
	'movies'  	: 'true',
	'shows'		: 'false',
	'documentaries'	: 'false',
	#'start'		: start,
	'_'		: 1447610192848
    }
    headers = {
	'Accept' 	  : 'application/json, text/javascript, */*; q=0.01',
	'Accept-Encoding' : 'gzip, deflate, sdch',
	'Accept-Language' : 'en-US,en;q=0.8,tr;q=0.6',
	'Cache-Control'	  : 'no-cache',
	'Connection'	  : 'keep-alive',
	'Host'		  : 'www.allflicks.net',
	'Pragma'	  : 'no-cache',
	'Referer'	  : 'http://www.allflicks.net/',
	'User-Agent'	  : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
	'X-Requested-With': 'XMLHttpRequest'
    }
    
    cookies = {
	'PHPSESSID'	: 'kaf6p0on6qln3jqhtv0qvp3v60',
	'__utma'	: '211810501',
	'__utmb'	: '211810501.1.10.1450151467',
	'__utmz'	: '211810501.1447610159.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)',
	'__utma'	: '211810501.591813640.1447610159.1447615343.1450151467.4',
	'us'		: 'J%3B1Fvh%26hVrdlFML'
    }
    
    scrape = True
    start  = 0
    while scrape:
	end 	 	= (start+99)
	file_handle 	= str(start+1) + "_" + str(end+1)
	print "**** " + file_handle
	
	outdir		= pwd + "/" + output_directory
	filepath 	= pwd + "/" + output_directory + "/"+ file_handle + '.json'
	
	params['start'] = start
	
	_request = Request('GET', url_base, params=params,headers=headers, cookies=cookies)
	_prepped = _request.prepare()
	
	if not os.path.exists(outdir):
	    os.makedirs(outdir);
        
	if not os.path.exists(filepath) or force_refresh:
	    print("Downloading page.....: " + _prepped.url);
	    _response = _session.send(_prepped)
	    if(_response and _response.json() and _response.json().get('data')):
		resp_data   	= _response.json().get('data')
		resp_len 	= len(resp_data)
		if resp_len < 100:
		    scrape = False;
		    
		file_handle 	= "%s_%s" 		% (str(start+1), str(start + resp_len))
		filepath 	= "%s/%s/%s.json"	% (pwd, output_directory, file_handle)
		
		with open(filepath, 'wb') as json_file:
		    json_file.write(json.dumps(resp_data, indent=4))
		    randomsleep(sleep_time)
	    else:
		scrape = False
		    
	start+=100

def merge_json_files():
    merged_file = pwd + '/data/netflix.json'
    print "Merging json files in '/" + output_directory + "/' into '" + merged_file + "'"
    
    read_files = glob.glob(pwd + "/" + output_directory + "/*.json")
    netflix_movies = []

    for f in read_files:
        with open(f, "rb") as infile:
            netflix_movies += json.load(infile)
	    
    netflix_movies = sorted(netflix_movies, key=lambda k: datetime.datetime.strptime(k['available'], '%d %b %Y'), reverse=True)
    with open(merged_file, "wb") as outfile:
        json.dump(netflix_movies, outfile, indent=4)
	print "Done"
	
def main():
    run_scraper()	
    merge_json_files()
    #print isNetflix('The Dempsey Sisters (2013)').get('id')
    
if __name__ == "__main__":
    main()