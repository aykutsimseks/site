import sys, os, re
from bs4 import BeautifulSoup,NavigableString
from HTMLParser import HTMLParser
import urllib2
import time
import datetime
import csv,json

from netflix import Netflix
nflix = Netflix("")

# http://www.imdb.com/movies-coming-soon/2015-05
url_base = 'http://www.imdb.com/movies-coming-soon'

start = ['2011','1']
end   = [datetime.datetime.now().strftime("%Y"),datetime.datetime.now().strftime("%m")]

sleep_time = 10

<<<<<<< HEAD

=======
pwd = os.path.dirname(os.path.realpath(__file__))
print pwd
>>>>>>> c4ad2870ba6a310e1c7e30e0a50f2a4938f3d01f

def mk_int(s):
    try:
        s = re.search(r'\d+',s).group()
        return int(s) if s else 0
    except:
	return ''
    
def get_url_content(url,page_id, loc='html', ext='html', s=sleep_time):
    outdir	= pwd + "/html"
    filepath 	= pwd + "/" + loc  +"/"+ page_id + '.' + ext
    
    if not os.path.exists(outdir):
        os.makedirs(outdir);
        
    if not os.path.exists(filepath):
        print("Downloading page.....: " + url);
	try:
	    contents = urllib2.urlopen(url).read()
	    with open(filepath, 'wb') as html:
	        html.write(contents)
		time.sleep(s)
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


def main():
    current = start;
    movie_list = []
    while (current[0] + current[1].zfill(2)) <= (end[0] + end[1].zfill(2)):
	handle = current[0] + '-' + current[1].zfill(2);
	print handle
	url = url_base + '/' + handle
        content = get_url_content(url,handle)
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
		run_time   = html_scraper(movie,[['other','time', 'itemprop','duration']])[0].text.encode('utf-8').strip()
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
		get_url_content(image_url,unique_id, loc='img/thumbnails', ext='png', s=1)
	    except:
		image_url = ''
		
	    try:
		netflix_url = nflix.isNetflix(title.split("(")[0]).get('playerUrl')
	    except:
	    	netflix_url = ''
		
	    json = {
		'title': title,
		'url': url,
		'unique_id': unique_id,
		'run_time': run_time,
		'genres': genres,
		'metascore': metascore,
		'month' : current[1],
		'year' : current[0],
		'description': description,
		'director'  : director,
		'stars'	    : stars,
		'image_url' : image_url,
		'netflix_url' : netflix_url
	    }
	    movie_list.append(json)
	if current[1] == '12':
	    current[0] = str(int(current[0])+1);
	current[1] = str((int(current[1])%12)+1);
	
	
    
    f = csv.writer(open(pwd + "/data/movies.csv", "wb+"))

    # Write CSV Header, If you dont need that, remove this line
    f.writerow(["title","url", "unique_id", "run_time", "metascore", "genres", "month", "year", "description","director","stars","image_url","netflix_url"])
    
    ids = set()
    
    for x in movie_list:
	if x["unique_id"] in ids: continue # skip duplicate
	ids.add(x["unique_id"])
        f.writerow([str(x["title"]),
		    str(x["url"]),
		    str(x["unique_id"]),
                    mk_int(x["run_time"]), 
		    mk_int(x["metascore"]), 
		    str(x["genres"]),
		    mk_int(x["month"]), 
		    mk_int(x["year"]),
		    str(x["description"]),
		    str(x["director"]),
		    str(x["stars"]),
		    str(x["image_url"]),
		    str(x["netflix_url"]),
		 ])
    
    
if __name__ == "__main__":
    main()