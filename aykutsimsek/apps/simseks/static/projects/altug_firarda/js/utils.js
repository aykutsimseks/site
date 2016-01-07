/*
/////// Import Below ///////
<script type="text/javascript" src="//cdn.jsdelivr.net/g/jquery,d3js@3.5.6,simple-statistics@1.0.0,underscorejs,highcharts@4.1.5,datejs@1.0,leaflet@0.7.7,bootstrap@3.3.6"></script>
*/

///////////// CONSTANTS /////////////////
var default_colors 	= ['#76c4ed', '#85c744', '#efa131', '#e78ac3','#ffd92f', '#c09ee2' , '#e5c494', '#b3b3b3', '#8da0cb', '#74c476', '#f2b257']
var colorbrewer={YlGn:{3:["#f7fcb9","#addd8e","#31a354"],4:["#ffffcc","#c2e699","#78c679","#238443"],5:["#ffffcc","#c2e699","#78c679","#31a354","#006837"],6:["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],7:["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],8:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],9:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]},YlGnBu:{3:["#edf8b1","#7fcdbb","#2c7fb8"],4:["#ffffcc","#a1dab4","#41b6c4","#225ea8"],5:["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],6:["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],7:["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],8:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],9:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]},GnBu:{3:["#e0f3db","#a8ddb5","#43a2ca"],4:["#f0f9e8","#bae4bc","#7bccc4","#2b8cbe"],5:["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"],6:["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#43a2ca","#0868ac"],7:["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],8:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],9:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"]},BuGn:{3:["#e5f5f9","#99d8c9","#2ca25f"],4:["#edf8fb","#b2e2e2","#66c2a4","#238b45"],5:["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],6:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],7:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],8:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],9:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]},PuBuGn:{3:["#ece2f0","#a6bddb","#1c9099"],4:["#f6eff7","#bdc9e1","#67a9cf","#02818a"],5:["#f6eff7","#bdc9e1","#67a9cf","#1c9099","#016c59"],6:["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#1c9099","#016c59"],7:["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],8:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],9:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"]},PuBu:{3:["#ece7f2","#a6bddb","#2b8cbe"],4:["#f1eef6","#bdc9e1","#74a9cf","#0570b0"],5:["#f1eef6","#bdc9e1","#74a9cf","#2b8cbe","#045a8d"],6:["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#2b8cbe","#045a8d"],7:["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],8:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],9:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"]},BuPu:{3:["#e0ecf4","#9ebcda","#8856a7"],4:["#edf8fb","#b3cde3","#8c96c6","#88419d"],5:["#edf8fb","#b3cde3","#8c96c6","#8856a7","#810f7c"],6:["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8856a7","#810f7c"],7:["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],8:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],9:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]},RdPu:{3:["#fde0dd","#fa9fb5","#c51b8a"],4:["#feebe2","#fbb4b9","#f768a1","#ae017e"],5:["#feebe2","#fbb4b9","#f768a1","#c51b8a","#7a0177"],6:["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#c51b8a","#7a0177"],7:["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],8:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],9:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]},PuRd:{3:["#e7e1ef","#c994c7","#dd1c77"],4:["#f1eef6","#d7b5d8","#df65b0","#ce1256"],5:["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],6:["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],7:["#f1eef6","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],8:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],9:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]},OrRd:{3:["#fee8c8","#fdbb84","#e34a33"],4:["#fef0d9","#fdcc8a","#fc8d59","#d7301f"],5:["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"],6:["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"],7:["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],8:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],9:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]},YlOrRd:{3:["#ffeda0","#feb24c","#f03b20"],4:["#ffffb2","#fecc5c","#fd8d3c","#e31a1c"],5:["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"],6:["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],7:["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],8:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],9:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]},YlOrBr:{3:["#fff7bc","#fec44f","#d95f0e"],4:["#ffffd4","#fed98e","#fe9929","#cc4c02"],5:["#ffffd4","#fed98e","#fe9929","#d95f0e","#993404"],6:["#ffffd4","#fee391","#fec44f","#fe9929","#d95f0e","#993404"],7:["#ffffd4","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],8:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],9:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"]},Purples:{3:["#efedf5","#bcbddc","#756bb1"],4:["#f2f0f7","#cbc9e2","#9e9ac8","#6a51a3"],5:["#f2f0f7","#cbc9e2","#9e9ac8","#756bb1","#54278f"],6:["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"],7:["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],8:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],9:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]},Blues:{3:["#deebf7","#9ecae1","#3182bd"],4:["#eff3ff","#bdd7e7","#6baed6","#2171b5"],5:["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"],6:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],7:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],8:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],9:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]},Greens:{3:["#e5f5e0","#a1d99b","#31a354"],4:["#edf8e9","#bae4b3","#74c476","#238b45"],5:["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"],6:["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"],7:["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],8:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],9:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]},Oranges:{3:["#fee6ce","#fdae6b","#e6550d"],4:["#feedde","#fdbe85","#fd8d3c","#d94701"],5:["#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"],6:["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"],7:["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],8:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],9:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"]},Reds:{3:["#fee0d2","#fc9272","#de2d26"],4:["#fee5d9","#fcae91","#fb6a4a","#cb181d"],5:["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],6:["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"],7:["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],8:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],9:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]},Greys:{3:["#f0f0f0","#bdbdbd","#636363"],4:["#f7f7f7","#cccccc","#969696","#525252"],5:["#f7f7f7","#cccccc","#969696","#636363","#252525"],6:["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#636363","#252525"],7:["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],8:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],9:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]},PuOr:{3:["#f1a340","#f7f7f7","#998ec3"],4:["#e66101","#fdb863","#b2abd2","#5e3c99"],5:["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"],6:["#b35806","#f1a340","#fee0b6","#d8daeb","#998ec3","#542788"],7:["#b35806","#f1a340","#fee0b6","#f7f7f7","#d8daeb","#998ec3","#542788"],8:["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"],9:["#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788"],10:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],11:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"]},BrBG:{3:["#d8b365","#f5f5f5","#5ab4ac"],4:["#a6611a","#dfc27d","#80cdc1","#018571"],5:["#a6611a","#dfc27d","#f5f5f5","#80cdc1","#018571"],6:["#8c510a","#d8b365","#f6e8c3","#c7eae5","#5ab4ac","#01665e"],7:["#8c510a","#d8b365","#f6e8c3","#f5f5f5","#c7eae5","#5ab4ac","#01665e"],8:["#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e"],9:["#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e"],10:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],11:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"]},PRGn:{3:["#af8dc3","#f7f7f7","#7fbf7b"],4:["#7b3294","#c2a5cf","#a6dba0","#008837"],5:["#7b3294","#c2a5cf","#f7f7f7","#a6dba0","#008837"],6:["#762a83","#af8dc3","#e7d4e8","#d9f0d3","#7fbf7b","#1b7837"],7:["#762a83","#af8dc3","#e7d4e8","#f7f7f7","#d9f0d3","#7fbf7b","#1b7837"],8:["#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837"],9:["#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837"],10:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],11:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"]},PiYG:{3:["#e9a3c9","#f7f7f7","#a1d76a"],4:["#d01c8b","#f1b6da","#b8e186","#4dac26"],5:["#d01c8b","#f1b6da","#f7f7f7","#b8e186","#4dac26"],6:["#c51b7d","#e9a3c9","#fde0ef","#e6f5d0","#a1d76a","#4d9221"],7:["#c51b7d","#e9a3c9","#fde0ef","#f7f7f7","#e6f5d0","#a1d76a","#4d9221"],8:["#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221"],9:["#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221"],10:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],11:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"]},RdBu:{3:["#ef8a62","#f7f7f7","#67a9cf"],4:["#ca0020","#f4a582","#92c5de","#0571b0"],5:["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"],6:["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"],7:["#b2182b","#ef8a62","#fddbc7","#f7f7f7","#d1e5f0","#67a9cf","#2166ac"],8:["#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac"],9:["#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac"],10:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],11:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]},RdGy:{3:["#ef8a62","#ffffff","#999999"],4:["#ca0020","#f4a582","#bababa","#404040"],5:["#ca0020","#f4a582","#ffffff","#bababa","#404040"],6:["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"],7:["#b2182b","#ef8a62","#fddbc7","#ffffff","#e0e0e0","#999999","#4d4d4d"],8:["#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d"],9:["#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d"],10:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],11:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"]},RdYlBu:{3:["#fc8d59","#ffffbf","#91bfdb"],4:["#d7191c","#fdae61","#abd9e9","#2c7bb6"],5:["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"],6:["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],7:["#d73027","#fc8d59","#fee090","#ffffbf","#e0f3f8","#91bfdb","#4575b4"],8:["#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4"],9:["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"],10:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],11:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]},Spectral:{3:["#fc8d59","#ffffbf","#99d594"],4:["#d7191c","#fdae61","#abdda4","#2b83ba"],5:["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"],6:["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"],7:["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"],8:["#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd"],9:["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"],10:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],11:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]},RdYlGn:{3:["#fc8d59","#ffffbf","#91cf60"],4:["#d7191c","#fdae61","#a6d96a","#1a9641"],5:["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"],6:["#d73027","#fc8d59","#fee08b","#d9ef8b","#91cf60","#1a9850"],7:["#d73027","#fc8d59","#fee08b","#ffffbf","#d9ef8b","#91cf60","#1a9850"],8:["#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850"],9:["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"],10:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],11:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]},Accent:{3:["#7fc97f","#beaed4","#fdc086"],4:["#7fc97f","#beaed4","#fdc086","#ffff99"],5:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0"],6:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f"],7:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17"],8:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]},Dark2:{3:["#1b9e77","#d95f02","#7570b3"],4:["#1b9e77","#d95f02","#7570b3","#e7298a"],5:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e"],6:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"],7:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],8:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]},Paired:{3:["#a6cee3","#1f78b4","#b2df8a"],4:["#a6cee3","#1f78b4","#b2df8a","#33a02c"],5:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99"],6:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c"],7:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f"],8:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00"],9:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"],10:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a"],11:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99"],12:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]},Pastel1:{3:["#fbb4ae","#b3cde3","#ccebc5"],4:["#fbb4ae","#b3cde3","#ccebc5","#decbe4"],5:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6"],6:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc"],7:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd"],8:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec"],9:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]},Pastel2:{3:["#b3e2cd","#fdcdac","#cbd5e8"],4:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4"],5:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9"],6:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae"],7:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc"],8:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"]},Set1:{3:["#e41a1c","#377eb8","#4daf4a"],4:["#e41a1c","#377eb8","#4daf4a","#984ea3"],5:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"],6:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33"],7:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628"],8:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf"],9:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]},Set2:{3:["#66c2a5","#fc8d62","#8da0cb"],4:["#66c2a5","#fc8d62","#8da0cb","#e78ac3"],5:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"],6:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"],7:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"],8:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]},Set3:{3:["#8dd3c7","#ffffb3","#bebada"],4:["#8dd3c7","#ffffb3","#bebada","#fb8072"],5:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3"],6:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462"],7:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"],8:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5"],9:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9"],10:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd"],11:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5"],12:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]}};


var x_axis = 'label'
var y_axis = 'value'
var font_family = "'Helvetica',Arial, sans-serif"
var no_data_text = "No Data Available"
var default_date_format = '%e %b %Y'


/// Census & CivicDashboards
var convert_state = function(name, to) {
	if(!name) return false;
    var name = name.toUpperCase();
    var states = new Array(                         {'name':'Alabama', 'abbrev':'AL'},          {'name':'Alaska', 'abbrev':'AK'},
        {'name':'Arizona', 'abbrev':'AZ'},          {'name':'Arkansas', 'abbrev':'AR'},         {'name':'California', 'abbrev':'CA'},
        {'name':'Colorado', 'abbrev':'CO'},         {'name':'Connecticut', 'abbrev':'CT'},      {'name':'Delaware', 'abbrev':'DE'},
        {'name':'Florida', 'abbrev':'FL'},          {'name':'Georgia', 'abbrev':'GA'},          {'name':'Hawaii', 'abbrev':'HI'},
        {'name':'Idaho', 'abbrev':'ID'},            {'name':'Illinois', 'abbrev':'IL'},         {'name':'Indiana', 'abbrev':'IN'},
        {'name':'Iowa', 'abbrev':'IA'},             {'name':'Kansas', 'abbrev':'KS'},           {'name':'Kentucky', 'abbrev':'KY'},
        {'name':'Louisiana', 'abbrev':'LA'},        {'name':'Maine', 'abbrev':'ME'},            {'name':'Maryland', 'abbrev':'MD'},
        {'name':'Massachusetts', 'abbrev':'MA'},    {'name':'Michigan', 'abbrev':'MI'},         {'name':'Minnesota', 'abbrev':'MN'},
        {'name':'Mississippi', 'abbrev':'MS'},      {'name':'Missouri', 'abbrev':'MO'},         {'name':'Montana', 'abbrev':'MT'},
        {'name':'Nebraska', 'abbrev':'NE'},         {'name':'Nevada', 'abbrev':'NV'},           {'name':'New Hampshire', 'abbrev':'NH'},
        {'name':'New Jersey', 'abbrev':'NJ'},       {'name':'New Mexico', 'abbrev':'NM'},       {'name':'New York', 'abbrev':'NY'},
        {'name':'North Carolina', 'abbrev':'NC'},   {'name':'North Dakota', 'abbrev':'ND'},     {'name':'Ohio', 'abbrev':'OH'},
        {'name':'Oklahoma', 'abbrev':'OK'},         {'name':'Oregon', 'abbrev':'OR'},           {'name':'Pennsylvania', 'abbrev':'PA'},
        {'name':'Rhode Island', 'abbrev':'RI'},     {'name':'South Carolina', 'abbrev':'SC'},   {'name':'South Dakota', 'abbrev':'SD'},
        {'name':'Tennessee', 'abbrev':'TN'},        {'name':'Texas', 'abbrev':'TX'},            {'name':'Utah', 'abbrev':'UT'},
        {'name':'Vermont', 'abbrev':'VT'},          {'name':'Virginia', 'abbrev':'VA'},         {'name':'Washington', 'abbrev':'WA'},
        {'name':'West Virginia', 'abbrev':'WV'},    {'name':'Wisconsin', 'abbrev':'WI'},        {'name':'Wyoming', 'abbrev':'WY'},
        {'name':'District of Columbia', 'abbrev':'DC'},
        {'name':'United States', 'abbrev':'US'}
    );
    var returnthis = false;
    $.each(states, function(index, value){
        if (to == 'name') {
            if (value.abbrev == name){
                returnthis = value.name;
                return false;
            }
        } else if (to == 'abbrev') {
            if (value.name.toUpperCase() == name){
                returnthis = value.abbrev;
                return false;
            }
        }
    });
    return returnthis;
}
var sumlevel_to_geo_type = function(sumlevel) {
	var geo_type = 'profiles'
	switch(sumlevel) {
		case '040' : geo_type =  'state'; break;
		case '050' : geo_type = 'county'; break;
		case '060' : geo_type = 'county_subdivision'; break;
		case '160' : geo_type =  'city' ; break;
		default    : geo_type = 'profiles'; break;
	}
	return geo_type;
}
var state_codes_to_text = { "01" : "Alabama", "02" : "Alaska", "04" : "Arizona", "05" : "Arkansas", "06" : "California", "08" : "Colorado", "09" : "Connecticut", 10 : "Delaware", 11 : "District Of Columbia", 12 : "Florida", 13 : "Georgia", 15 : "Hawaii", 16 : "Idaho", 17 : "Illinois", 18 : "Indiana", 19 : "Iowa", 20 : "Kansas", 21 : "Kentucky", 22 : "Louisiana", 23 : "Maine", 24 : "Maryland", 25 : "Massachusetts", 26 : "Michigan", 27 : "Minnesota", 28 : "Mississippi", 29 : "Missouri", 30 : "Montana", 31 : "Nebraska", 32 : "Nevada", 33 : "New Hampshire", 34 : "New Jersey", 35 : "New Mexico", 36 : "New York", 37 : "North Carolina", 38 : "North Dakota", 39 : "Ohio", 40 : "Oklahoma", 41 : "Oregon", 42 : "Pennsylvania", 44 : "Rhode Island", 45 : "South Carolina", 46 : "South Dakota", 47 : "Tennessee", 48 : "Texas", 49 : "Utah", 50 : "Vermont", 51 : "Virginia", 53 : "Washington", 54 : "West Virginia", 55 : "Wisconsin", 56 : "Wyoming", 60 : "American Samoa", 66 : "Guam", 72 : "Puerto Rico", 78 : "Virgin Islands" }
var civicdashboards_sumlevels = ['010','040','050','060','160','860']
var civicdashboards_indicators = [
	{
    	text: 'People Indicators',
        children: [
        	{id: "total_population"					,text: "Total Population"},
        	{id: "percent_of_us_population"			,text: "Percent of US Population"},
        	{id: "percent_of_state_population"		,text: "Percent of State Population"},
        	{id: "percent_population_change"		,text: "Percent Population Change"},
        	{id: "dependency_ratio"					,text: "Dependency Ratio"},
        	{id: "percent_foreign_born"				,text: "Percent Foreign Born"},
        	{id: "percent_under_18"					,text: "Percent Under 18"},
        	{id: "percent_over_65"					,text: "Percent Over 65"},
        ]
    },
    {
    	text: 'Economic Indicators',
        children: [
        	{id: "unemployment_rate"				,text: "Unemployment Rate"},
        	{id: "percent_living_in_poverty"		,text: "Percent Living in Poverty"},
        	{id: "median_household_income"			,text: "Median Household Income"},
        	{id: "gini_index"						,text: "Gini Index"},
        	{id: "number_of_businesses_per_100000"	,text: "Number of Businesses per 100,000"},
        	{id: "patents_per_100000"				,text: "Patents per 100,000"},
        ]
    },
    {
    	text: 'Safety Indicators',
        children: [
        	{id: "homicides_per_100000"				,text: "Homicides per 100,000"},
        	{id: "violent_crimes_per_100000"		,text: "Violent Crimes per 100,000"},
        	{id: "property_crimes_per_100000"		,text: "Property Crimes per 100,000"},
        ]
    },
    {
    	text: 'Housing Indicators',
        children: [
        	{id: "total_housing_units"				,text: "Total Housing Units"},
        	{id: "median_rent"						,text: "Median Rent"},
        	{id: "total_building_permits"			,text: "Total Building Permits"},
        	{id: "occupied_housing_units"			,text: "Occupied Housing Units"},
        	{id: "homeownership_rate"				,text: "Homeownership Rate"},
        	{id: "single_family_building_permits"	,text: "Single Family Building Permits"},
        	{id: "residential_density"				,text: "Residential Density"},
        	{id: "rental_vacancy_rate"				,text: "Rental Vacancy Rate"},
        	{id: "multifamily_building_permits"		,text: "Multifamily Building Permits"},
        	{id: "persons_per_household"			,text: "Persons per Dwelling Unit"},
        ]
    },
    {
    	text: 'Educiation Indicators',
        children: [
        	{id: "percent_high_school_graduation",	text: "Percent with High School Diploma or Higher"},
        	{id: "percent_higher_education_degree",	text: "Percent with Bachelors Degree or Higher"},
        ]
    },
]
var sumlevMap = {
    "010": {"name": "nation", "plural": "nations", "sumlev": "010",
            "children": ['020','030','040','050','060','140','150','160','250','310','500','610','620','860','950','960','970']},
    "020": {"name": "region", "plural": "regions", "sumlev": "020",
            "children": ['030','040','050','060','140','150','160','250','310','500','610','620','860','950','960','970']},
    "030": {"name": "division", "plural": "divisions", "sumlev": "030",
            "children": ['040','050','060','140','150','160','250','310','500','610','620','860','950','960','970']},
    "040": {"name": "state", "plural": "states", "sumlev": "040",
            "children": ['050','060','140','150','160','250','310','500','610','620','860','950','960','970']},
    "050": {"name": "county", "plural": "counties", "sumlev": "050",
            "children": ['060','140','150','160','500','610','620','860','950','960','970']},
    "060": {"name": "county subdivision", "plural": "county subdivisions", "sumlev": "060",
            "children": ['140','150','160','250','310','500','610','620','860','950','960','970']},
    "140": {"name": "census tract", "plural": "census tracts", "sumlev": "140",
            "children": ['150']},
    "150": {"name": "block group", "plural": "block groups", "sumlev": "150",
            "children": []},
    "160": {"name": "place", "plural": "places", "sumlev": "160",
            "children": ['140','150','860']},
    "170": {"name": "consolidated city", "plural": "consolidated cities", "sumlev": "170",
            "children": []},
    "230": {"name": "Alaska native regional corporation", "plural": "Alaska native regional corporations", "sumlev": "230",
            "children": []},
    "250": {"name": "native area", "plural": "native areas", "sumlev": "250",
            "children": ['140','150','860']},
    "251": {"name": "tribal subdivision", "plural": "tribal subdivisions", "sumlev": "251",
            "children": []},
    "256": {"name": "tribal tract", "plural": "tribal tracts", "sumlev": "256",
            "children": []},
    "310": {"name": "metro area", "plural": "metro areas", "sumlev": "310",
            "children": ['050','060','140','150','160','860']},
    "314": {"name": "metropolitan division", "plural": "metropolitan division", "sumlev": "314",
            "children": []},
    "330": {"name": "combined statistical area", "plural": "combined statistical areas", "sumlev": "330",
            "children": []},
    "335": {"name": "combined NECTA", "plural": "combined NECTAs", "sumlev": "335",
            "children": []},
    "350": {"name": "NECTA", "plural": "NECTAs", "sumlev": "350",
            "children": []},
    "364": {"name": "NECTA division", "plural": "NECTA divisions", "sumlev": "364",
            "children": []},
    "400": {"name": "urban area", "plural": "urban areas", "sumlev": "400",
            "children": []},
    "500": {"name": "congressional district", "plural": "congressional districts", "sumlev": "500",
            "children": ['050','060','140','150','160','860']},
    "610": {"name": "state house (upper)", "plural": "state houses (upper)", "sumlev": "610",
            "children": ['050','060','140','150','160','860']},
    "620": {"name": "state house (lower)", "plural": "state houses (lower)", "sumlev": "620",
            "children": ['050','060','140','150','160','860']},
    "795": {"name": "PUMA", "plural": "PUMAs", "sumlev": "795",
            "children": []},
    "860": {"name": "ZIP code", "plural": "ZIP codes", "sumlev": "860",
            "children": ['140','150']},
    "950": {"name": "school district (elementary)", "plural": "school districts (elementary)", "sumlev": "950",
            "children": ['060','140','150','160','860']},
    "960": {"name": "school district (secondary)", "plural": "school districts (secondary)", "sumlev": "960",
            "children": ['060','140','150','160','860']},
    "970": {"name": "school district (unified)", "plural": "school districts (unified)", "sumlev": "970",
            "children": ['060','140','150','160','860']}
};


/// Tokens & etc
var civicdashboards_hosts = [
		"www.civicdashboards.com",
		"civicdashboards.com",
]
var site_url 		  = "https://www.civicdashboards.com"
var static_api 		  = "https://static.civicdashboards.com"
var mongodb_api 	  = "https://apimd.pediacities.com"
var postgres_api 	  = "https://apipg.pediacities.com"
////////////////////////////////////////



/////////////  UTILS  //////////////
/// Internal JS
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
Array.prototype.contains = function(it) { return this.indexOf(it) != -1; };

var isFunction = function(x) {
 return Object.prototype.toString.call(x) == '[object Function]';
}
var urlParam = function(name, w){
    w = w || window;
    var rx = new RegExp('[\&|\?]'+name+'=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? '':val[1];
}
var urlParams = function (url) {
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = url;

	result = {};
	while (match = search.exec(query))
	 	result[decode(match[1])] = decode(match[2]);
	return result
}
var getIfNotSet = function(value, newValue, overwriteNull, overwriteZero) {
    if (typeof (value) === 'undefined') {
        return newValue;
    } else if (value === null && overwriteNull === true) {
		return newValue;
    } else if (value === 0 && overwriteZero === true) {
        return newValue;
    } else {
    	return value;
    }
}

/// JSON
var jsonGetSubField		= function(obj, fields) {
	var el = obj;
	fields.forEach( function(f) {
		el = el[f]
	})
	return el;
}
var jsonToArray 		= function(obj) {
	return $.map(obj, function(el) { return el; });
}
var jsonToArrayKey 	    = function(obj,key) {
	return $.map(obj, function(el) {
		if(key instanceof Array) {
			return jsonGetSubField(el,key)
		}
		else {
			return el[key]
		}
	});
}
var jsonArrayToObject   = function(jsonarray, key) {
	var json = {}
	jsonarray.forEach(function (w) {
		json[w[key]] = w;
	})
	return json;
}
var jsonArraySearch   	= function(value, key, array){
    for (var i=0; i < array.length; i++) {
    	var cur_val = array[i];
    	if(key instanceof Array) {
			cur_val = jsonGetSubField(cur_val,key)
		}
		else {
			cur_val = cur_val[key]
		}
    	if (cur_val === value) {
            return i;
        }
    }
    return -1;
}
var jsonArrayAddFields 	= function(data, old_keys, new_keys, delete_old) {
	for(var i = 0; i < data.length; i++) {
		for(var k = 0; k < new_keys.length; k++) {
			data[i] = jsonAddFields(data[i], old_keys[k], new_keys[k],  delete_old)
		}
	}
	return data
}
var jsonAddFields 		= function(json, old_key, new_key, delete_old) {
	var key   	  = new_key['key'] 		|| new_key;
	var format 	  = new_key['format']	|| null;
	var old_key   = old_key;
	if(old_key) {
		json[key] = json[old_key]
		if(format) {
			json[key] = format(json[key]);
		}
	}
	if(delete_old) {
		delete json[old_key];
	}
	return json
}
var jsonFilterFields  	= function(obj, keys) {
	var json = {}
	keys.forEach(function (k) {
		json[k] = obj[k];
	})
	return json;
}

/* !!!! Update This */
var jsonAddLabelValue = function(data, x, y) {
	for(var i = 0; i < data.length; i++) {
		data[i][x_axis] = data[i][x] || x
		data[i][y_axis] = Number(data[i][y])
	}
	return data
}


/// Display
var toTitleCase = function(str){
	if(str) {
	    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	else {
		return ""
	}
}
var numberWithCommas = function(n) {
	/*
	var parts = n
		.toString()
		.split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
	*/
	return Number(n).toLocaleString();
}
var zfill = function(num, len) {
	return (Array(len)
			.join("0") + num)
		.slice(-len);
}
var formatDisplayValue = function(value, type, default_value) {
	if(isFunction(type)) return type(value);

	if(type == undefined || type == null || type == "") { type = "None" }

	if(!default_value) { default_value = '' }


	// floatxx100 will mutliply number with 100 and display as float
	var multiply_match = type.match(/xx(\d+)$/);
	if(multiply_match) {  
		type	= type.split(multiply_match[0])[0] 
		value 	= value * parseInt(multiply_match[1]); 
	}

	// float1xx100 or float1 will set fixedPoint to 1.
	var fixed_match    = type.match(/\d+$/);
	
	var fixed	= null
	if(fixed_match) {
		type	= type.split(fixed_match[0])[0];
		fixed 	= fixed_match[0]
	}

	//if(value == "N/A" || value == null || (!date_parse(value) && isNaN(value))) type = "none";

	switch(type) {
		case 'integer':
			return numberWithCommas(Number(value||0).toFixed(fixed||0));
		case 'float':
			return numberWithCommas(Number(value||0).toFixed(fixed||2));
		case 'percent':
			return numberWithCommas(Number(value||0).toFixed(fixed||2)) + "%";
		case 'dollar':
			return "$" + numberWithCommas(Number(value||0).toFixed(fixed||0));
		case 'string':
			return String(value);
		case 'date':
			return Highcharts.dateFormat(default_date_format,  (date_parse(value) || new Date(value)) )
		case 'time_diff':
			function printTime(n, type) {
				n + " " + type + (value>1?"s":"");
			}

			value = Number(value||0);
			var years 	= Math.floor(value / 31104000);
			if(years > 0) 	{ return printTime(years,'year') }

			var months 	= Math.floor(value / 2592000);
			if(months > 0) 	{ return printTime(months,'month') }

			var days 	= Math.floor(value / 86400);
			if(days > 0) 	{ return printTime(days,'day') }

			var hours 	= Math.floor(value / 3600);
			if(hours > 0) 	{ return printTime(hour,'hour') }

			var minutes = Math.floor(value / 60);
			if(minutes > 0) { return printTime(minutes,'minute')}

			return printTime(value, 'seconds');
		case 'none':
			return default_value;
		default:
			return String(value)
	}
}
var sortDisplayValue   = function(a,b,value_type){
	if(isFunction(value_type)) return a > b ? 1 : a == b? 0 : -1;

	switch(value_type) {
		case 'integer':
		case 'float':
		case 'percent':
		case 'dollar':
			var numA = Number(a);
			var numB = Number(b);
			return numA > numB ? 1 : numA == numB ? 0 : -1;
		case 'date':
		case 'time_diff':
			var dateA = date_parse(a) || new Date(a);
			var dateB = date_parse(b) || new Date(b);
			return dateA > dateB ? 1 : dateA == dateB? 0: -1;
		case 'string':
		case 'none':
		default:
			return a.toString().localeCompare(b.toString());
	}
}
var sortValue   	   = function(a,b,value_type) {
	if(isFunction(value_type)) return a > b ? 1 : a == b? 0 : -1;

	switch(value_type) {
		case 'integer':
		case 'float':
		case 'percent':
		case 'dollar':
		case 'date':
		case 'time_diff':
			return a > b ? 1 : a == b? 0: -1;
		case 'string':
		case 'none':
		default:
			return a.toString().localeCompare(b.toString());
	}
}


var decideTrend = function(v1, v2, direction) {
	// arrow options 'normal', 'inverse', 'netural', 'none'
	if(v1 && v2) {
		var color = 'rgba(255,255,255,1)';
		switch(direction) {
			case 'inverse':
				color 	= ((v1 > v2)?'rgba(238,9,17,1)':((v2 > v1)?'rgba(104,184,40,1)':'rgba(255,255,255,1)'))
				break;
			case 'none':
				color	= 'rgba(0,0,0,0)'
				break;
			case 'neutral':
				color	= 'rgba(255,255,255,1)'
				break;
			case 'normal':
			default:
				color 	= ((v1 > v2)?'rgba(104,184,40,1)' :((v2 > v1)?'rgba(238,9,17,1)':'rgba(255,255,255,1)'))
				break;
		}


		if(v1 > v2) {
			return { 'value': 1	,	'direction' : 'up'		, 'icon' : 'fa-arrow-up'	, 'color' : color}
		}
		else if(v2 > v1) {
			return { 'value': -1,	'direction' : 'down'	, 'icon' : 'fa-arrow-down'	, 'color' : color }
		}
		else {
			return { 'value': 0	,	'direction' : 'same'	, 'icon' : ''/*'fa-minus'*/	, 'color' : color }
		}
	}
	return null;
}
var decideTheme = function(color) {
	var res_col = resolve_color(color)
	if ((res_col[0]*0.299 + res_col[1]*0.587 + res_col[2]*0.114) > 186) {
		return { "bg" : color, "text" : "#000000", "text-alt" : "#333", "bg-hover" : "#333333", "text-hover" : "#aaaaaa", "class" : 'dark' , "layer" : "#ffffff", }
	}
	else {
		return { "bg" : color, "text" : "#ffffff", "text-alt" : "#ddd", "bg-hover" : "#aaaaaa" , "text-hover" : "#333333", "class" : 'light', "layer" : "#000000", }
	}
}

/// Date
var months 			= [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var date_parse = function(d) {
	return (d instanceof Date)?d:Date.parse(d);
}

var formatDateMY = function( date ) {
	return 	months[date%12] + " " +
			parseInt(date/12);
}

var dateValMY = function(d) {
	return d.getMonth() + d.getFullYear()*12
}


// Math
var generateBuckets 		 = function(values, factor) {
	var sorted = values.map(function(d) { return Number(d)}).sort(function(a, b) {return a - b;});
	bins 	= ss.ckmeans(sorted, Math.min(sorted.length,factor))
	breaks 	= bins.map(function(d) { return d.slice(-1)[0]})
	return { 'bins' : bins, 'breaks' : breaks}
}
var binary_search_iterative  = function(a, value) {
  var mid, lo = 0,
      hi = a.length - 1;

  while (lo <= hi) {
    mid = Math.floor((lo + hi) / 2);

    if (a[mid] > value) {
      hi = mid - 1;
    } else if (a[mid] < value) {
      lo = mid + 1;
    } else {
      return mid;
    }
  }
  return mid;
}

///////// END OF GENERIC FUNCTIONS ///////////


//////////// SLUGIFY ////////////
// underscore.string formatters
var escapeRegExp = function(str) {
  if (str == null) return '';
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
var defaultToWhiteSpace = function(characters) {
  if (characters == null)
    return '\\s';
  else if (characters.source)
    return characters.source;
  else
    return '[' + escapeRegExp(characters) + ']';
}
var nativeTrim = String.prototype.trim;
var trim = function(str, characters) {
  if (str == null) return '';
  if (!characters && nativeTrim) return nativeTrim.call(str);
  characters = defaultToWhiteSpace(characters);
  return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
}
var dasherize = function(str) {
  return trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}
var slugify = function(str) {
  if (str == null) return '';

  var from = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
      to = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
      regex = new RegExp(defaultToWhiteSpace(from), 'g');

  str = String(str).toLowerCase().replace(regex, function(c){
    var index = from.indexOf(c);
    return to.charAt(index) || '-';
  });

  return dasherize(str.replace(/[^\w\s-]/g, ''));
}
//////////// END OF SLUGIFY ///////////



////////// COLOR FUNCTIONS /////////////
var generateSingleColorRamp = function(color,theNumSteps){
	var theColor 	= resolve_color(color);
	var colorLight 	= "rgb(" + Math.min(theColor[0]+240,255) + "," + Math.min(theColor[1]+240,255) + "," + Math.min(theColor[2]+240,255) + ")"
  	var colorDark	= "rgb(" + Math.min(theColor[0],255) + "," + Math.min(theColor[1],255) + "," + Math.min(theColor[2],255) + ")"
  	return generateColorRamp(colorDark,colorLight,theNumSteps);
}
var generateColorRamp 		= function(begin,end,theNumSteps){
	var colors = [];
	theColorBegin 	= resolve_color(begin);
	theColorEnd 	= resolve_color(end);

  	theR0 = theColorBegin[0];
  	theG0 = theColorBegin[1];
  	theB0 = theColorBegin[2];

  	theR1 = theColorEnd[0];
  	theG1 = theColorEnd[1];
  	theB1 = theColorEnd[2];
  	// return the interpolated value between pBegin and pEnd
  	function interpolate(pBegin, pEnd, pStep, pMax) {
    	if (pBegin <= pEnd) {
			return ((pEnd - pBegin) * (pStep / pMax)) + pBegin;
  		}
  		else
  		{
			return ((pBegin - pEnd) * (1 - (pStep / pMax))) + pEnd;
		}
 	}

  	function generateColor(){
    	for (i = 0; i < theNumSteps; i++) {
			theR = interpolate(theR0, theR1, i, theNumSteps);
 			theG = interpolate(theG0, theG1, i, theNumSteps);
 			theB = interpolate(theB0, theB1, i, theNumSteps);
  			theVal = ((( theR << 8 ) |  theG ) << 8 ) | theB;
      		colors[i] = parseColor(theVal);
      	}
  	}
	generateColor();

	return colors.reverse();
}
var resolve_color = function(color){
    // return an array containing R, G and B values
    if(isTransparent(color))// IE (6 and ?)
        color = '#FFF';

    var r,g,b;
    var hex_color_pcre = new RegExp("^#[0-9a-f]{3}([0-9a-f]{3})?$",'gi');
    var rgb_color_pcre 	= new RegExp( "rgb\\(\\s*((?:[0-2]?[0-9])?[0-9])\\s*,\\s*((?:[0-2]?[0-9])?[0-9])\\s*,\\s*((?:[0-2]?[0-9])?[0-9])\\s*\\)$",'gi');
    var rgba_color_pcre = new RegExp("rgba\\(\\s*((?:[0-2]?[0-9])?[0-9])\\s*,\\s*((?:[0-2]?[0-9])?[0-9])\\s*,\\s*((?:[0-2]?[0-9])?[0-9])\\s*,\\s*((\\.\\d+)?|0(\\.\\d+)?|1(\\.0+)?)\\s*\\)$",'gi');
    var rgb_percent_color_pcre = new RegExp("rgb\\(\\s*((?:[0-1]?[0-9])?[0-9])%\\s*,\\s*((?:[0-1]?[0-9])?[0-9])%\\s*,\\s*((?:[0-1]?[0-9])?[0-9])%\\s*\\)$",'gi');

   	if(color.match(hex_color_pcre)){
        if(color.length == 4){
            r  = color.charAt(1)+""+color.charAt(1);
            g  = color.charAt(2)+""+color.charAt(2);
            b  = color.charAt(3)+""+color.charAt(3);
        }
        else{
            r  = color.charAt(1)+""+color.charAt(2);
            g  = color.charAt(3)+""+color.charAt(4);
            b  = color.charAt(5)+""+color.charAt(6);
        }
        r = h2d(r);
        g = h2d(g);
        b = h2d(b);
    }
    else if(color.match(rgb_color_pcre)){
        r = parseInt(RegExp.$1);
        g = parseInt(RegExp.$2);
        b = parseInt(RegExp.$3);
    }
    else if(color.match(rgba_color_pcre)){
    	a = Number(RegExp.$4);
    	r = parseInt(RegExp.$1) * a;
        g = parseInt(RegExp.$2) * a;
        b = parseInt(RegExp.$3) * a;
    }
    else if(color.match(rgb_percent_color_pcre)){
        r = parseInt((RegExp.$1)*2.55);
        g = parseInt((RegExp.$2)*2.55);
        b = parseInt((RegExp.$3)*2.55);
    }
    else
        return false;
    var returned =[r,g,b]
    return returned;
}
var color_distance = function(v1, v2){
    var i,
    	d = 0;

    for (i = 0; i < v1.length; i++) {
        d += (v1[i] - v2[i])*(v1[i] - v2[i]);
    }
    return Math.sqrt(d);
}
var h2d = function(h) {
    // hex to decimal
    return parseInt(h,16);
}
var parseColor = function(color) {

	if (typeof color === 'number') {
		//make sure our hexadecimal number is padded out
		color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
	}

	return color;

};
var getBackgroundColor = function(element_id) {
	var bgcolor = $(element_id).css('background-color') || $(element_id).css('background');
	if (isTransparent(bgcolor)){
    	$(element_id).parents().each(function(){
        	if (!isTransparent($(this).css('background-color') || $(this).css('background'))){
            	bgcolor = $(this).css('background-color') || $(this).css('background');
            	return bgcolor;
        	}
	    });
	}
	return bgcolor;
}
var isTransparent = function(color){
    return (!color || color=="transparent");
}
///// END OF COLOR FUNCTIONS ///////////



//////////    CLASSES    /////////////


// DATA GROUPER
// Useful for aggregating data
// http://jsbin.com/usepej/1/edit?html,js,output
var DataGrouper = (function() {
    var has = function(obj, target) {
        return _.any(obj, function(value) {
            return _.isEqual(value, target);
        });
    };

    var keys = function(data, names) {
        return _.reduce(data, function(memo, item) {
            var key = _.pick(item, names);
            if (!has(memo, key)) {
                memo.push(key);
            }
            return memo;
        }, []);
    };

    var group = function(data, names) {
    	if(names) {
	        var stems = keys(data, names);
    	    return _.map(stems, function(stem) {
        	    return {
                	key: stem,
            	    vals:_.map(_.where(data, stem), function(item) {
                	    return _.omit(item, names);
                	})
            	};
        	});
        }
        else {
        	return [{key:{}, vals: data}]
        }
    };

    group.register = function(name,converter,field_groups) {
        return group[name] = function(data, names, field_groups) {
        	var g = _.map(group(data, names), function(d) { return converter(d,field_groups)});
        	return g
        };
    };

    return group;
}());

// Registered Functions
DataGrouper.register("sum", function(item, field_groups) {
	field_groups.forEach( function(k) {
		var obj = {}
		obj[k]	= _.reduce(item.vals, function(memo, node) { return memo + Number(node[k])||0; }, 0)
		_.extend(item, item.key, obj);
	})
	return item;
});

DataGrouper.register("avg", function(item, field_groups) {
	field_groups.forEach( function(k) {
		var length = item.vals.length;
		var obj = {}
		obj[k]	= _.reduce(item.vals, function(memo, node) { return memo + Number(node[k])||0; }, 0)/item.vals.length
		_.extend(item, item.key, obj);
	})
	return item;
});

DataGrouper.register("count", function(item) {
	return _.extend({}, item.key, {value: _.reduce(item.vals, function(memo, node) {
		return memo + 1;
	}, 0)});
});

DataGrouper.register("field_count", function(item, field) {
	return _.extend({}, item.key, {value: _.reduce(item.vals, function(memo, node) {
		if(node[field] != null && node[field] != undefined && node[field] != '' && !isNaN(node[field])) {
			return memo + 1;
		}
		return memo;
	}, 0)});
});


// CIVICCHARTS
var CivicCharts = (function(config, data, data_options) {
});

CivicCharts.prototype.draw				= function(config, data, data_options) {
	var _config		  				= config 				|| {};
		_config['chart_type'] 		= config['chart_type'] 	|| 'data_table';

	switch(_config['chart_type']) {
		// HighCharts
		case 'line':
			this.line_chart(config, data, data_options);
			break;
		case'spark_line':
			this.spark_line_chart(config, data, data_options);
			break;
		case 'bar':
			this.bar_chart(config, data, data_options);
			break;
		case 'pie':
			this.pie_chart(config, data, data_options);
			break;
		case 'donut':
			this.donut_chart(config, data, data_options);
			break;
		// Others
		case 'map':
			this.map(config, data, data_options);
			break;

		case 'info_box':
			this.info_box(config, data, data_options);
			break;
		case 'data_table':
			this.data_table(config, data, data_options);
			break;

		case 'modal_box':
			this.modal_box(config, data, data_options);
			break;
		default:
			console.log('Unrecognized chart_type:' + _config['chart_type'])
			return false;
	}
	return true;
}

// HighCharts
CivicCharts.prototype.generic_options	= function(config) {
	var _config		  		= config 		 || {}
	_config['theme'] 		= config['theme'] 		|| decideTheme(getBackgroundColor(config['element_id']));
	_config['value_type'] 	= config['value_type'] 	|| 'string'

	return {
		exporting: {
			enabled			: false
		},
		credits: {
			enabled			: false
		},
		chart: {
			type			: _config['type'],
			renderTo		: _config['element_id'],
			backgroundColor	: _config['theme']['bg']   || 'rgba(255, 255, 255, 0)',
			plotShadow		: false,
			spacingTop		: 15,
			style: {
				fontFamily 	: font_family,
				color		: _config['theme']['text'] || 'rgb(0,0,0)',
			}
		},
		title: {
			floating		: false,
			align			: 'left',
			text			: _config['title'] || '',
			style : {
				color		: _config['theme']['text'] || 'rgb(0,0,0)',
				fontSize	: '20px',
			},
			useHTML: true,
		},
		tooltip: {
			backgroundColor		: _config['theme']['layer']   || 'rgba(255, 255, 255, 0)',
			style: {
				color		: _config['theme']['text'] || 'rgb(0,0,0)',
				opacity		: .4,
				margin		: 'auto'
			},
			shadow: false,
			shared: true,
			borderWidth		: 2,
			useHTML			: true,
			formatter		: function() {
				var tooltip;
				var points = this.points;

				var v = (points?points[0]:this);
				var label = v.key;
				if(_config['date_format'] || _config['type'].endsWith('line')) {
					label = Highcharts.dateFormat(_config['date_format'] || '%e %b %Y',  date_parse(label))
					if(label.startsWith('Invalid date')) { label = v.key }
				}

				if(points && points.length > 1) {
					tooltip  = '<div style="text-align:left;font-size:.9em;direction:ltr;padding:2px;">'
						 	 + '<div style="text-align:center;font-size:1.2em;">' + label + '</div>'

					if(_config['stacking']) {
						var total_y= 0;
						$.each(points, function () { total_y += this.y; });

						tooltip += '<div style="font-size:1em;width:100%;font-weigth:500;text-align:center;">'
								+  'Total:&nbsp;'
								+  '<span style="text-align:right;font-weight: 800">' + formatDisplayValue(total_y, _config['value_type']) + '</span></div>'
								+  '<hr style="margin: 5px 0"/>'
					}
					for(var i = 0; i < points.length; i++) {
						tooltip += '<div style="font-size:1em;width:100%;font-weigth:500;">'
								+  '<span style="color:' + points[i].series.color + '">\u25CF</span> ' + points[i].series.name + ':&nbsp;'
								+  '<span style="text-align:right;font-weight: 800">' + formatDisplayValue(points[i].y, _config['value_type']) + '</span></div>'
					}
					tooltip += '</div>'
				}
				else {
					tooltip  = '<div style="text-align:center;font-size:.9em;direction:ltr;padding:2px;">'
						 	 + '<div>' + label + '</div>'
							 + '<div style="font-size:1.2em;font-weigth:800;">'
							 + formatDisplayValue(v.y, _config['value_type']) + '</div>'
							 + '</div>'
				}
				return tooltip;
			},
		},
		plotOptions: {
			pie: {
				allowPointSelect	: false,
				colors 				: default_colors,
				cursor				: 'pointer',
				dataLabels			: {
					style			: {
						color		: _config['theme']['text'],
						opacity		: 1,
						fontWeight	: 800,
						textShadow: false
					},
					distance		: -25,
					formatter		: function () {
						if(this.percentage > 10)  return Math.round(this.percentage)  + '%';
					}
				},
				borderWidth: 0,
				borderColor: _config['theme']['bg'],
				showInLegend: true
			},
			column: {
				cursor: 'pointer',
				borderWidth: 0,
				groupPadding: .04
			},
			line: {
				cursor: 'pointer',
				lineWidth: 3,
				marker: {
					enabled: true,
					radius: 2,
					symbol: 'circle',
				}
			},
			area : {
				cursor: 'pointer',
				lineWidth: 3,
				fillOpacity: .4,
				marker: {
					enabled: true,
					radius: 3,
					symbol: 'circle',
				}
			},
			spline: {
				cursor: 'pointer',
				lineWidth: 4,
				marker: {
					enabled: true,
					radius: 4,
					symbol: 'circle',
				}
			},
			areaspline : {
				marker: {
					enabled: false
				},
			},
			series: {
				states : {
					hover : {
						 lineWidth: 3,
					}
				}
			},
		},
		legend: {
			enabled			: true,
			layout			: 'horizontal',
			floating		: false,
			verticalAlign	: 'bottom',
			align			: 'center',
			borderWidth		: 0,
			y				: 0,
			padding			: 0,
			itemStyle 		: {
				color		: _config['theme']['text'],
				opacity		: 1,
				fontSize	: 11,
				fontWeight	: 600,
			},
			itemHoverStyle 	: {
				color		: _config['theme']['text'],
				opacity		: .7,
			}
		},
		xAxis: {
			type			: 'category',
			lineWidth		: 0,
			minorTickLength	: 0,
			labels			: {
				style		: {
					color	: _config['theme']['text'],
					fontSize: 10,
				}
			},
		},
		yAxis: {
			title: {
				text		: ''
			},
			gridLineWidth	: .5,
			gridLineColor	: _config['theme']['text'],
			gridLineDashStyle: 'Dot',
			labels: {
				style: {
					color	: _config['theme']['text'],
					fontSize: 10,
				}
			},
		}
	}
}

CivicCharts.prototype.line_chart 		= function(config, data, data_options) {
	var _config		  = config 		|| {}
	var	_data 		  = data 		|| [[]]
	var _data_options = data_options || []

	var h_data = []
	var groups = d3.set(
					d3
						.merge(_data)
						.sort(function(a, b) { return _config['date_format']?date_parse(a[x_axis]) - date_parse(b[x_axis]):a[x_axis] - b[x_axis]})
						.map(function(r) 	 { return _config['date_format']?Highcharts.dateFormat(_config['date_format']||'%Y',  date_parse(r[x_axis])):r[x_axis]})
					).values()
	_data.forEach(function(series, i) {
		var s = {
			//data : series.map(function(r) { return Number(r[y_axis])}),
			data :
				(_config['stacking']?
				    series.map(function(r) { return Number(r[y_axis])})
				  : series.map(function(r) { return {x: date_parse(r[x_axis]), y: Number(r[y_axis])}})
				)
		}
		$.extend(s, _data_options[i]||{})
		s.color = s.color || default_colors[i]
		s.data = s.data.sort(function(a, b) { return a.x - b.x })
		if(s.data.length > 0) {
			h_data.push(s)
		}
	})

	_config['type'] = _config['type']||(_config['stacking']?'area':'line')

	var chart_json = this.generic_options(_config)
	var line_options = {
		chart	: {
			type	: _config['type']
		},
		xAxis	: {
			type		: 'datetime',
			categories	: (_config['stacking']?groups:null),
		},
		legend	: {
			enabled	: (h_data.length >= 2)
		},
		plotOptions : {
			area : {
				stacking: (_config['stacking']?'normal':null),
			}
		},
		series 	: h_data
	}
	$.extend(true,chart_json, line_options)
	$.extend(true,chart_json, _config)
	$(_config['element_id']).highcharts(chart_json);
	return true
}

CivicCharts.prototype.spark_line_chart 	= function(config, data, data_options) {
	var _config		  = config 		 || {}
	var _data		  = data		 || [[]]
	var _data_options = data_options || []
	var spark_line_options = {
		chart: {
			type 					: 'areaspline'
		},
		plotOptions: {
			series:{
				lineWidth			: 2,
				marker: {
					enabled			: true,
					radius			: 3,
					symbol			: 'circle',
				},
				shadow				: false,
				states: {
					hover :{
						lineWidth	: 2,
						halo : {
							size	: 4
						}
					}
				},
			}
		},
		xAxis: {
			labels: {
				enabled				: false
			},
			lineWidth				: 0,
			minorGridLineWidth		: 0,
			lineColor				: 'transparent',
			minorTickLength			: 0,
			tickLength				: 0
		},
		yAxis: {
			title: {
				text				: ''
			},
			gridLineWidth			: 0,
			labels: {
				enabled				: false
			},
		}
	}
	$.extend(true, spark_line_options, _config);

	// Default line style if not specified
	_data_options.push({'color' : 'rgba(255, 255, 255, .6)', fillColor:'rgb(255,255,255)', fillOpacity:.3})
	this.line_chart(spark_line_options,_data,_data_options)
	return spark_line_options
}

CivicCharts.prototype.bar_chart 		= function(config, data, data_options) {
	var _config		  = config 		|| {}
	var _data 		  = data 		|| [[]]
	var _data_options = data_options || []

	var h_data = []
	var s = []

	var groups = d3.set(
					d3
						.merge(_data)
						.sort(function(a, b) { return _config['date_format']?date_parse(a[x_axis]) - date_parse(b[x_axis]):a[x_axis] - b[x_axis]})
						.map(function(r) 	 { return _config['date_format']?Highcharts.dateFormat(_config['date_format']||'%Y',  date_parse(r[x_axis])):r[x_axis]})
					).values()

	_data.forEach(function(series, i) {
		s = {
			data : series.map(function(r) { return r[y_axis]}),
		}
		$.extend(s, _data_options[i]||{})
		s.color = s.color || default_colors[i]
		//s.data = s.data.sort(function(a, b) { return a.x - b.x })
		if(s.data.length > 0) {
			h_data.push(s)
		}
	})
	_config['type'] = _config['type']||'column'
	var chart_json = this.generic_options(_config)
	var bar_options = {
		chart	: {
			type	: 'column'
		},
		xAxis	: {
			categories	: groups,
		},
		legend	: {
			enabled	: (h_data.length >= 2)
		},
		plotOptions : {
			column : {
				stacking : _config['stacking']?'normal':null
			}
		},
		series 	: h_data
	}
	$.extend(true,chart_json, bar_options)
	$.extend(true,chart_json, _config)

	$(_config['element_id']).highcharts(chart_json);
	return chart_json
}

CivicCharts.prototype.pie_chart 		= function(config, data, data_options) {
	var _config		  = config 		|| {}
	var _data 		  = (data?[data[0]]:[[]])
	var _data_options = data_options || []

	var h_data = []
	var s = []


	_data.forEach(function(series, i) {
		series = series.filter(function (x) { return x[y_axis];})
		s = {
			data : series.map(function(r) { return [r[x_axis], r[y_axis]]}),
			size : '100%',
			colorByPoint: true,
		}
		$.extend(s, _data_options[i]||{})
		s.color = s.color || default_colors[i]
		//s.data = s.data.sort(function(a, b) { return a.x - b.x })
		if(s.data.length > 0) {
			h_data.push(s)
		}
	})
	_config['type'] = _config['type']||'pie'
	var chart_json = this.generic_options(_config)
	var pie_options = {
		chart	: {
			type	: 'pie'
		},
		legend	: {
			enabled	: true
		},
		series 	: h_data
	}
	$.extend(true,chart_json, pie_options)
	$.extend(true,chart_json, _config)


	if(_config['mono_color'] && h_data.length > 0) {
		chart_json.plotOptions.pie.colors = (function () {
			var colors = [],
				base = _config['mono_color'] || default_colors[0],
				i;

			for (i = 0; i < h_data[0].data.length; i += 1) {
				// Start out with a darkened base color (negative brighten), and end
				// up with a much brighter color
				colors.push(Highcharts.Color(base).brighten((i - 1) / h_data[0].data.length).get());
			}
			return colors;
		}());
	}
	$(_config['element_id']).highcharts(chart_json);
	return chart_json
}

CivicCharts.prototype.donut_chart 		= function(config, data, data_options) {
	var _config		  = config 		 || {}
	var _data		  = data		 || [[]]
	var _data_options = data_options || []
	var donut_options = {
		plotOptions : {
			pie	: {
				startAngle 	: -90,
				endAngle	: 90,
				center		: ['50%','100%']
			}
		}
	}
	$.extend(true, donut_options, _config);

	_data_options= [{ 'size' : Math.min($(_config['element_id']).height(), $(_config['element_id']).width()) ,'innerSize': '30%'}]
	this.pie_chart(donut_options,_data,_data_options)
	return donut_options
}

// Others
CivicCharts.prototype.info_box		  	= function(config, data, data_options) {
	var _config		 			= config 				|| {}
		_config['theme'] 		= config['theme'] 		|| decideTheme(getBackgroundColor(config['element_id']));
		_config['value_type'] 	= config['value_type'] 	|| 'string'
	var _data 		 			= (data?data[0]|| []:[])
	var _data_options 			= data_options || []

	d3.select(_config['element_id'] + " .infobox").remove()
	var infobox = d3.select(_config['element_id'])
		.append('div')
		.classed('infobox', true)
		.style('background', _config['theme']['bg'])
		.style('font-family', font_family)
		.style('padding'	 , 0)
		.style('height'	 , '100%')
		.style('cursor','pointer')


	// Title
	var title = infobox
	  .append('div')
	  .classed('infobox-title', true)
	  .style({
		'letter-spacing': '0.1em',
		'padding'		: '6px 10px',
		'font-size'		: '16px',
		'text-align'	: 'center',
		'background'	: 'rgba(255,255,255,.2)',
		'color'			: _config['theme']['text']
	  })
	  .html(_config['title']?(_config['title']['text']||''):'')


	// Text
	var text = infobox
	  .append('div')
	  .classed('infobox-text', true)
	  .style({
		'padding'		: '6px 10px',
		'font-size'		: '48px',
		'text-align'	: 'center',
		'font-weight'	: '300',
		'padding'		: '25px 25px 25px 25px',
		'color'			: _config['theme']['text']
	  })


	// Text Content
	var text_content 		= "";
	var no_data_available 	= true;
	if(_data.length > 0) {
		_data = _data.sort( function(a, b) { return date_parse(b[x_axis]) - date_parse(a[x_axis]) })

		var current_value  = _data[0][y_axis];
		var previous_value = (_data.length > 1)?(_data[1][y_axis] || null):null;

		// Set trend;
		var trend = decideTrend(current_value, previous_value, _config['direction']);

		if(current_value) {
			no_data_available = false;
			switch(_config['value_type']) {
				case 'percent':
					text_content 	+= formatDisplayValue(current_value, 'integer')
									+  '<span style="vertical-align: super;font-size: 24px;">%</span>'
					break;
				case 'dollar':
					text_content 	+= '<span style="vertical-align: super;font-size: 24px;">$</span>'
									+  formatDisplayValue(current_value,'integer')
					break;
				default:
					text_content	+= formatDisplayValue(current_value,'integer')
					break;
			}
		}

		if(trend) {
			text_content 	+= '<span style="vertical-align: super;font-size: 24px;">'
							+  '<i style="position:absolute;font-size:32px;margin-left:5px;margin-top:2px;color:' + trend['color'] + '" '
							+  ' class="fa ' + trend['icon'] + '"></i>'
							+  '</span>'

			text_content 	+= '<span class="infobox-hover-text" style="vertical-align: baseline;opacity:.9;font-size: 14px;visibility:hidden;">'
							+  '<span style="font-size:12px;">&nbsp;&nbsp;was </span>' + formatDisplayValue(previous_value, _config['value_type'])
							+  '</span>'
		}
	}

	if(no_data_available){ text_content = "--</br><span style='font-size:14px'>" + no_data_text + "</span>"; }

	text
	  .html(text_content)

	infobox
		.on("mouseover", function() {
			text.select('.infobox-hover-text').style('visibility','visible')
			title.style('background','rgba(255,255,255,.3)')
		})
		.on("mouseout", function() {
			text.select('.infobox-hover-text').style('visibility','hidden')
			title.style('background','rgba(255,255,255,.2)')
		})


	// Sparkline
	if(_data.length > 1) {
		var space_left =
			infobox.node().getBoundingClientRect().height
			- title.node().getBoundingClientRect().height
			- text.node().getBoundingClientRect().height
			+ 25;

		if(space_left > 50) {
			infobox
				.append('div')
				.attr('id', _config['element_id'].substring(1) + "_sparkline")
				.classed('sparkline', true)
				.style('height',space_left + "px")
				.style('width', '100%')
				.style('margin', 'auto')
				.style('margin-top', '-30px')

			var info_spark_options = {
				'element_id' : _config['element_id'] + "_sparkline",
				'title'		 : null,
				'theme' : {
					'bg'	 :  'rgba(0,0,0,0)',
				},
				'tooltip': {
					backgroundColor 	: 'rgba(0,0,0,.2)',
					borderWidth	  		: 1,
				}
			}

			$.extend(true, _config, info_spark_options);
			_data_options =  {'color' : 'rgba(255, 255, 255, .6)', fillColor:'rgba(255,255,255,.3)'}
			this.spark_line_chart(_config, [_data], [_data_options])
		}
	}

	return _config
}

CivicCharts.prototype.data_table 		= function(config, data, data_options) {
	var no_data_text = "No Records Found"

	var _config		 			= config 				|| {}
		_config['theme'] 		= config['theme'] 		|| decideTheme(getBackgroundColor(config['element_id']));
		_config['value_type'] 	= config['value_type'] 	|| 'string'

	var _data 		 			= (data?data[0]||[]:[])
	var _data_options 			= data_options || []

	//var columns = _data_options.map(function(d) { return d.column })
	//columns = (columns.length > 0?columns:d3.keys(_data[0]))

	var previousSort = null;
	var initSort 	 = null;
	if(_data_options.length <= 0) {
		_data_options = d3.keys(_data[0]).map( function(d) { return  {'name' : d, 'column' : d, 'value_type' : 'string'}})
	}
	else {
		_data_options = _data_options.map( function(d) {  if(d.sort) { initSort = d.column; if(d.sort == -1) { previousSort = d.column } }; return  {'name' : (d.name || d.column), 'column' : d.column, 'value_type' : (d.value_type || 'string')}})
	}
	if(!_data_options[0]) return;

	initSort = initSort || _data_options[0]['column'];

	var widget_box = d3.select(_config['element_id']).node().getBoundingClientRect()

	var fixed 			= d3.select(_config['element_id'])
							.append('div')
							.style({
								  'position': 'relative',
								  'background' 	: _config['theme']['text'],
							})

	var title = (_config['title'] && _config['title']['text'])?_config['title']['text']:null
	var title_container = fixed
		.append('div')
		.classed('data-table-title', true)
		.style({
			'letter-spacing': '0.1em',
			'font-size'		: '18px',
			'padding'		: '10px',
			'padding-bottom': (title?'30px':'20px'),
			'text-align'	: 'left',
			'background' 	: _config['theme']['bg'],
			'color'			: _config['theme']['text'],
		})
		.html(title?_config['title']['text']:'')

	var table_container	= fixed
						.append("div")
						.style('margin', 0)
						.style('height',function() { return widget_box.height - fixed.node().getBoundingClientRect().height})
						.style('overflow-y' , 'auto')
						//.style('background' , _config['theme']['bg']);

	var tableBox = table_container.node().getBoundingClientRect()

	var fieldHeight = 30 //Math.max((tableBox.height  - 31 - (title?title.node().getBoundingClientRect().height:0)) /(_data.length),30);
	var fieldWidth 	= tableBox.width /_data_options.length;

	var table 	= table_container
					.append("table")
					.style('margin', 0)
					.style('width','100%')
					.style('font-size','.8em')
					.style('display','table')
					.style('text-align'   , 'left');

	var headerGrp 	= table.append("thead")
					.attr("class", "data-table-header")
					.style('display','table-header-group')
					.style('overflow-x','auto')

	// create the table header
	var header = headerGrp.selectAll("th")
					.data(jsonToArrayKey(_data_options,'name'))
					.enter().append("th")
					.attr("class", "table-header")
					.style({
						'height'		: fieldHeight + 'px',
						'min-width'		: '7em',
						'background' 	: _config['theme']['bg'],
						'color'		 	: _config['theme']['text'],
						'padding'		: '0',
						'cursor'		: 'pointer',
					})

	if(_config['fixed_headers'] != false) {
		header
			.style('height',0)
			.style('line-height',0)

		header
			.append('div')
			.on("click", function(d){ return refreshTable(_data_options[jsonArraySearch(d,['name'],_data_options)].column)})
			.style({
				'height'   	 	: fieldHeight + 'px',
				'line-height'	: fieldHeight + 'px',
				'background' 	: _config['theme']['bg'],
				'color'		 	: _config['theme']['text'],
				'cursor'		: 'pointer',
				'top'			: (title?title_container.node().getBoundingClientRect().height-fieldHeight:0),
				'padding'		: '0 10px',
				'position'		: 'absolute',
				'margin'		: 'auto',
				'vertical-align': 'middle',
			})
			.attr('title',String)
			.attr('text-anchor','middle')
			.text(String);
	}
	else{
		title_container
			.style('padding-bottom','10px')

		header
			.style('border-radius','0')
			.style('padding','10px')
			.on("click", function(d){ return refreshTable(_data_options[jsonArraySearch(d,['name'],_data_options)].column)})
			.attr('title',String)
			.text(String)
	}

	var rowsGrp 	= table.append("tbody")
					.attr("class", "data-table-body")




	var rows = rowsGrp.selectAll(".table-row")
				.data(_data,  function(d,i){ return i; })

	var current_style
	// create rows
	var rowsEnter = rows.enter().append("tr")
		.attr("class","table-row")
		.attr("transform", function (d, i){
			return "translate(0," + (i+1) * (fieldHeight+1) + ")";
		})
		.style('background', function(d,i) { return (i%2==0)?_config['theme']['text-alt']:_config['theme']['text']})
		.style('cursor', 'pointer')
		.on("mouseover", function(d,i) {
			current_style = d3.select(this).selectAll("td.cell").style()
			d3.select(this)
			   .selectAll("td.cell")
			   .style('background' 	, _config['theme']['layer'])
			   .style('color' 		, _config['theme']['text'])
		})
		.on("mouseout", function() {
			d3.select(this)
			   .selectAll("td.cell")
			   .attr('style', function(d,i){
			   		var style_json = $.extend(true, {
							'vertical-align' : 'middle',
							'color'			 : _config['theme']['layer'],
							'height'   		 : fieldHeight,
							'padding-left'	 : '10px'
						},
						_data_options[i]['style'] || {}
					)
					var style = ""
					for (var s in style_json) {
						style += s + ":" + style_json[s] + ";"
					}
					return style
			   })
		});

	// select cells
	var cells = rows.selectAll("td.cell")
				.data(function(d){
					var selected_fields = jsonFilterFields(d, jsonToArrayKey(_data_options,'column'))
					return d3.values(selected_fields)
				});

	// create cells
	var cellsEnter = cells.enter().append("td")
		.attr("class", "cell")
		.attr('style', function(d,i){
			var style_json = $.extend(true, {
					'vertical-align' : 'middle',
					'color'			 : _config['theme']['layer'],
					'height'   		 : fieldHeight,
					'padding-left'	 : '10px'
				},
				_data_options[i]['style'] || {}
			)
			var style = ""
			for (var s in style_json) {
				style += s + ":" + style_json[s] + ";"
			}
			return style
		})
		.text(function(d,i) { return formatDisplayValue(d, _data_options[i]['value_type'])});

	// Add No data text if no data available
	if(_data.length == 0) {
		rowsGrp
			.append('tr')
			.append('td')
			.attr("class", "cell")
			.attr('colspan', _data_options.length)
			.style({
				'vertical-align' : 'middle',
				'text-align'	 : 'center',
				'color'			 : _config['theme']['layer'],
				'height'   		 : fieldHeight,
				'font-weight'	 : 'bold'
			})
			.text(no_data_text)
	}
	refreshTable(initSort);

	function refreshTable(sortOn){
		// fill the table
		// select rows

		//update if not in initialisation
		if(sortOn !== null) {
			// update rows
			if(sortOn != previousSort){
				rows.sort(function(a,b){ return sortDisplayValue(a[sortOn], b[sortOn], _data_options[jsonArraySearch(sortOn,['column'],_data_options)].value_type)})
					.style('background', function(d,i) { return (i%2)?_config['theme']['text-alt']:_config['theme']['text']})
				//console.log(rows)
				previousSort = sortOn;
			}
			else{
				rows.sort(function(a,b){ return sortDisplayValue(b[sortOn], a[sortOn], _data_options[jsonArraySearch(sortOn,['column'],_data_options)].value_type)})
					.style('background', function(d,i) { return (i%2)?_config['theme']['text-alt']:_config['theme']['text']})
				//console.log(rows)
				previousSort = null;
			}
		}
	}
	return _config
}

CivicCharts.prototype.map		  		= function(config, data, data_options) {
	var _config		 			= config 				|| {}
		_config['map'] 			= config['map'] 		|| {}

	var	_data 		  			= data 					|| [[]]
	var _data_options 			= data_options 			|| []

	var id 						= _config['element_id'].substring(1)
	var bounding_box 			= d3.select(_config['element_id']).node().getBoundingClientRect()

	d3.select(_config['element_id'])
	  .append('div')
	  .attr('id', id + '_map')
	  .style('height'	,'100%')
	  .style('width'	,'100%')

	////// LEAFLET MAP //////


	// Configure Map
	var allowMapDrag = ($(window).width() > 480) ? true : false;
	var map_config = {
		boxZoom			: false,
		keyboard		: false,
		zoomControl		: false,
		dragging		: allowMapDrag,
		touchZoom		: allowMapDrag,
	}
	$.extend(true, map_config, _config['map']['options'])

	// Init map
	var map = L.map(id + '_map',map_config);

	// Zoom Position
	var zoom_position = _config['map']['options']['zoom_position'] || 'bottomright'
	new L.Control.Zoom({ position: zoom_position}).addTo(map);

	// Base Layer
	if(_config['map']['base_layer']) {
		var base_layer_config = {
			opacity			: 1,
			reuseTiles 		: true
		}
		$.extend(true, base_layer_config, _config['map']['base_layer']['options'])

		var base_layer_url = _config['map']['base_layer']['url'] || "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
		L.tileLayer(base_layer_url, base_layer_config).addTo(map)
	}


	var features 	 = [];
	var featureGroup = null ;



	var drawMapElement = function(array, opts) {
		var element_config = {
		}
		switch(opts['type']) {
			case 'marker':
				element_config = {
					icon : L.icon({
						iconUrl		: site_url + '/static/img/icons/location.png',
						iconSize	: [28,38],
						iconAnchor	: [14,36]
					})
				}
				$.extend(true, element_config, opts)
				array.forEach( function(d,i) {
					var f = new L.Marker(d, element_config)
					f.addTo(map);
					features.push(f)
				})
				break;
			case 'circle':
				element_config = {
					weight		: 1.0,
					opacity		: 0.3,
					color: '#074887',
					fillColor: '#074887',
					fillOpacity: .75,
					radius: 12
				}
				$.extend(true, element_config, opts)
				array.forEach( function(d,i) {
					var f = new L.circleMarker(d, element_config)
					f.addTo(map);
					features.push(f)
				})
				break;
			case 'geojson':
			case 'choropleth':
				var default_opacity = (opts['type'] == 'choropleth')?1:.3;
				element_config = {
					style: {
							clickable	: true,
							weight		: 1.0,
							opacity		: 0.3,
							color		: "#074887",
							fillColor	: '#074887',
							fillOpacity	: default_opacity,
					},
					zIndex: 2,
					onEachFeature: function(feature, layer) {
						layer.on('mouseover', function() {
							layer.setStyle({ "fillOpacity": 0.5});
							if(opts['hover']) {
								layer.label.setContent(opts['hover'](feature));
							}
						});
						layer.on('mouseout', function() {
							layer.setStyle({ "fillOpacity": default_opacity});
						});
						if(opts['hover']) {
							layer.bindLabel('',{ direction: 'auto'})
						}
					}
				}
				$.extend(true, element_config, opts)
				////  Additional Choropleth Styling
				if(opts['type'] == 'choropleth' && opts['value_field']) {
					var feature_array 	  = array[0]['features'];
					var choroColor    	  = element_config['style']['fillColor'];

					var bucket_size	  = Math.min(feature_array.length, (opts['bucket_size'] || 5)) // Avoid generating more than data size
					var buckets 	  = generateBuckets(jsonToArrayKey(feature_array,opts['value_field']),bucket_size)
					var colorRamp	  = generateSingleColorRamp(choroColor,bucket_size)


					var s_init = $.extend(element_config.style,{})
					element_config.style = function(feature) {
						var s 		= s_init;
						var index 	= binary_search_iterative(buckets['breaks'],Number(jsonGetSubField(feature,opts['value_field'])));
						s.fillColor = colorRamp[index]
						return s
					}

					// Add legend
					if(_config['map']['options']['legend']) {
						var	legend_container = d3.select(_config['element_id'])
							  		.select('.leaflet-bottom.leaflet-right')
							  		.insert("div",":first-child")
							 		.classed('leaflet-control', true)
							  		.classed('leaflet-bar',true)
							  		.style({
										'z-index'  		: 99999,
										'background'	: 'rgba(255,255,255,.7)',
										'padding'		: '8px 10px 4px 10px',
										'display'		: 'flex'
							  		})

						if(!d3.select(_config['element_id'] + ' .leaflet-bottom.leaflet-right .leaflet-control-zoom').empty()) {
							legend_container
								.style('margin-bottom','-54px')
								.style('margin-right','54px')
						}

						legend_container
							.append('div')
							.style({
								'padding-right'	: '5px',
								'line-height'	: '24px',
								'font-weight'	: 'bold'
							})
							.text('Low')

						var format = d3.format('2.2s');

						legend_container
								.append('div')
								.style('width',0)
								.append('div')
								.style({
									'margin-top' 	: '24px',
									'margin-left'	: '-12px',
									'width'			: '24px',
									'text-align'	: 'center',
									'font-size'		: '.8em'
								})
								.text(format(buckets['bins'][0][0]))


						var createSquare = function(color, v) {
							legend_container
								.append('div')
								.style({
									'height'		: '24px',
									'width'			: '24px',
									'background'	: color
								})
								.append('div')
								.style({
									'margin-top' 	: '24px',
									'margin-left'	: '12px',
									'width'			: '24px',
									'text-align'	: 'center',
									'font-size'		: '.8em'
								})
								.text(format(v))
						}

						colorRamp.forEach( function(color,c) {
							createSquare(color,buckets['breaks'][c]);
						})


						legend_container
							.append('div')
							.style({
								'padding-left'	: '5px',
								'line-height'	: '24px',
								'font-weight'	: 'bold'
							})
							.text('High')
						/*
						for ( var i=0; i< breaks.length; i+=bucketing_factor ) {
							$('#bin' + parseInt(i/bucketing_factor)).html('<div style="width:28px;text-align:center;">' + format(breaks[Math.min(i,breaks.length-1)]) + '</div>')
						}
						$('#bin0').html('<div style="width:28px;text-align:center;">' +  format(d3.min(values)) + '</div>')
						$('#bin' + (breaks.length/bucketing_factor)).html('<div style="width:28px;text-align:center;">' +  format(d3.max(values)) + '</div>')
						*/
					}
				}
				//// End of Choropleth Styling
				array.forEach( function(d,i) {
					var f = new L.geoJson(d, element_config)
					f.addTo(map);
					features.push(f)
				})
				break;
			default:
				break;
		}
	}

	data.forEach( function(d,i) {
		drawMapElement(d,_data_options[i]);
	})


	// Set View
	if(features.length > 0 && !map_config['fixed']) {
		featureGroup = new L.featureGroup(features);
		map.fitBounds(featureGroup.getBounds());
		if(map_config['center']) {
			map.setView(map_config['center'], map_config['zoom']||14)
		}
		else {
			if(map_config['zoom']) {
				map.setZoom(map_config['zoom'])
			}
		}
	}
	else {
		var center 		= map_config['center'] 	|| [40.7374103,-73.9923010];
		var zoom_level 	= map_config['zoom'] 	|| 14;
		map.setView(center, zoom_level)
	}

	return _config
}

CivicCharts.prototype.modal_box			= function(config, data, data_options) {
	var _config		 			= config 				|| {}
	_config['modal']			= config['modal']		|| {}
	_config['modal']['style']   = $.extend(true, _config['modal']['style'], {
				'width' : '50%',
				'height': '300px'
			})


	var	_data 		  			= data 					|| [[]]
	var _data_options 			= data_options 			|| []

	var modal = d3.select('body')
					.append('div')
					.attr('id',_config['element_id'].slice(1))
					.classed('modal', true)
					.classed('fade', true)
					.attr('role','dialog')
					.style('height'	,'100%')
					.style('width'	,'100%')

					.append('div')
					.classed('modal-dialog', true)

					.style('width'	, _config['modal']['style']['width'])

					.append('div')
					.classed('modal-content', true)

	var title = modal
		.append('div')
		.classed('modal-header', true)

	title
		.append('button')
		.attr('type','button')
		.classed('close',true)
		.attr('data-dismiss','modal')
		.html('&times;')

	modal
		.append('div')
		.classed('modal-title', true)


	var modal_body_id = 'modal_' + _config['element_id'].slice(1) + '_body'
	modal
		.append('div')
		.classed('modal-body', true)
		.classed('col-md-12', true)
		.attr('id', modal_body_id)
		.style({
			'background' 	: 'rgba(255,255,255,1)',
			'height'	 	: _config['modal']['style']['height'],
			'margin-bottom' : '30px',
		})

	var modal_body_config = $.extend(true, _config['modal']['body'], {'element_id' : '#' + modal_body_id})

	var footer = modal
				.append('div')
				.classed('modal-footer', true)
	footer
		.append('button')
		.attr('type','button')
		.classed('btn',true)
		.classed('btn-default',true)
		.attr('data-dismiss','modal')
		.html('Close')


	$(_config['element_id']).show()
	this.draw(modal_body_config, _data, _data_options)
	$(_config['element_id']).hide()
}

// CIVICWIDGETS
var CivicWidgets = (function(config, data, data_options, widget_options) {
	this.config 		= config;
	this.data			= data;
	this.data_options 	= data_options;
	this.widget_options	= widget_options;

	if((!this.data || this.data.length == 0) && (widget_options.api || (widget_options.source && widget_options.source == 'civicdashboards'))){
		var chart_obj = this;
		switch(widget_options.source) {
			case 'civicdashboards':
				var all_indicator_data = []
				widget_options.place_list.forEach( function(place, pindex) {
					var geoid 		= place['geoid'];
					var name  		= place['name'];
					var sum_level 	= geoid.substr(0, 3);
					var geo_type 	= sumlevel_to_geo_type(sum_level)

					widget_options.indicator_list.forEach( function(indicator, iindex) {
						var url = static_api + '/1.0/data/indicators/' + indicator + '/' + sum_level + '/' + geoid +'.json'
						$.ajax({
						  url: url,
						  dataType: 'json',
						  async: false,
						  success: function(items, textStatus, jqXHR) {
						  	all_indicator_data.push(items)
						  }
					   })
					})
				})
				chart_obj.config.value_type = all_indicator_data[0]['value_type'].toLowerCase()
				switch(chart_obj.config.chart_type) {
					case 'line':
						chart_obj.data = all_indicator_data.map( function(line) { return line['historical_data'].map( function(d) { var r = {}; r[x_axis] = String(d['label']); r[y_axis] = d['value'] ; return r })})
						break;
					case 'bar':
					case 'pie':
					case 'donut':
						chart_obj.data 			= all_indicator_data.map( function(d,i) {
							return d['historical_data'].map( function(d) { var r = {}; r[x_axis] = d['label']; r[y_axis] = d['value'] ; return r })
						})
						break;
					case 'infobox':
						break;
					default:
						break;
				}

				// Set group labels
				chart_obj.data_options 	= all_indicator_data.map( function(d,i) {
					var opts = chart_obj.data_options[i];
					return $.extend(true, opts, {'name' : d['place']['name'], 'color' : default_colors[i] })
				})
				chart_obj.reload_widget();
				break;
			case 'ckan':
				if(widget_options.api.aggregate && widget_options.api.url.match(/\/datastore_search\?/g)) {
					var agg = null;
					widget_options.api.url = resolveDatastoreAPItoSQL(widget_options.api, widget_options.api.x, config.chart_type, agg);
					widget_options.api.y   = 'value';
				}
				var callBack = function(response) {
					chart_obj.data = [response];
					chart_obj.data.map( function(d) { return jsonAddLabelValue(d, widget_options.api.x,widget_options.api.y) });
					chart_obj.reload_widget();
				}
				this.execute_api_query(callBack);
				break;
			case 'other':
			default:
				var callBack = function(response) {
					chart_obj.data = [response];
					chart_obj.data.map( function(d) { return jsonAddLabelValue(d, widget_options.api.x,widget_options.api.y) });
					chart_obj.reload_widget();
				}
				this.execute_api_query(callBack);
				break;

		}
	}
	else {
		this.reload_widget();
	}
});

CivicWidgets.prototype.to_json				= function() {
	var json = {
		'config' 		: this.config,
		'data'	 		: this.data,
		'data_options' 	: this.data_options,
		'widget_options': this.widget_options
	}
	return json;
}

CivicWidgets.prototype.execute_api_query	= function(ajaxCallBack) {
	var data = [];
	var widget_obj = this;

	var url 			= this.widget_options.api['url']			|| '';
	var x 				= this.widget_options.api['x'] 				|| x_axis;
	var y 				= this.widget_options.api['y'] 				|| y_axis;
	var records_array 	= this.widget_options.api['records_array'] 	|| [];  // ['result','records'] for CKAN

	function ajaxReq(ajaxCallBack) {
	   // make first request
	   $.ajax({
		  url: url,
  		  dataType: 'jsonp',
  		  cache: true,
		  success: function(items, textStatus, jqXHR) {
		  	for(var r = 0; r < records_array.length; r++) {
				if(records_array[r])
					items = items[records_array[r]];
					if(!items) break;
			}
			data = items;
			ajaxCallBack(data);
		  }
	   });
	}
	ajaxReq(ajaxCallBack)
	return data;
}

CivicWidgets.prototype.reload_widget		= function() {
	var chart     = new CivicCharts().draw(this.config,this.data,this.data_options)
}

/* !!!! Update This */
var resolveDatastoreAPItoSQL = function(api, field, chart_type, agg) {
	var q = api['url']

	//if(!agg) agg = field;

	var sql_query =  q.split('/datastore_search?')[0] + '/datastore_search_sql?sql='

	var params = urlParams(q.split('?')[1])

	if(agg && agg != null) {
		sql_query += 'SELECT date_trunc(\'' + agg + '\', "' + field +'") "' + agg + '", COUNT("' + field +'") as value'
				   + ' FROM \"' + params['resource_id'] + '\"'
				   + ' GROUP BY 1'
	}
	else {
		sql_query += 'SELECT "' + field +'", COUNT("' + field +'") as value'
				   + ' FROM \"' + params['resource_id'] + '\"'
				   + ' GROUP BY "' + field + '"'
	}

	if(!params['sort']) {
		sql_query += ' ORDER BY "value"  desc'
	}
	else {
		var sort_params = params['sort'].split(/(asc|desc)/g);
		var p1 = sort_params[0].trim().replace(/"*/g,'');
		var p2 = sort_params[1].trim()
		sql_query += ' ORDER BY "' + p1 + '"'
		sql_query += ' ' + p2
	}
	if(params['limit']) {
		sql_query += ' LIMIT ' + params['limit']
	}
	return sql_query;
}


// DASHBOARDS
var CivicDashboards = (function(widgets, config) {
	var dashboard	= this;

	this.widgets	= widgets.map(function(w) { return dashboard.process_widget_json(w)}) || [];
	this.config 	= $.extend(true, {
		// Gridstack Defaults
		always_show_resize_handle	: false,
		animate						: true,
		auto						: true,
		cell_height					: 22,
		draggable					: {handle: '.grid-stack-item-content', scroll: true, appendTo: 'body'},
		handle						: '.grid-stack-item-content',
		handle_class				: null,
		height						: 0,
		float						: false,
		item_class					: 'grid-stack-item',
		min_width					: 768,
		placeholder_class			: 'grid-stack-placeholder',
		static_grid					: false,
    	resizable					: {autoHide: true, handles: 'se'},
    	vertical_margin 			: 0,
    	width						: 12,
		// Other options
		element_id					: '#cd-dashboard',
	}, config)

	this.gridstack	=	$(config['element_id']).gridstack(this.config).data('gridstack');



	if(this.config.resizable) {
	 	$(config['element_id']).on('resizestart', function (event, ui) {
        	var widget_id = $(event.target).attr('id').split('widget-')[1]
        	d3.select("#" + widget_id).html('')
        })

		$(config['element_id']).on('resizestop', function (event, ui) {
			var widget_id = $(event.target).attr('id').split('widget-')[1]
			var widget_index = jsonArraySearch('#' + widget_id, ['config','element_id'], dashboard.widgets)
			dashboard.add_widget(dashboard.widgets[widget_index])
		})
	}
})

CivicDashboards.prototype.process_widget_json	= function(w) {
	var widget_defaults = {
		'config' : {
			'value_type': 'integer'
		},
		'data'			: [],
		'data_options'	: [],
		'widget_options': {
			'size_x'	: 4,
			'size_y'	: 8
		}
	}
	//// Handle old CivicDashboards widgets
	if(w.chart) {
		w = {
			'config' : {
				'element_id' 		: w.chart.element_id,
				'chart_type'		: w.chart.chart_type.replace(/^h/i,''),
				'theme' 	 		: decideTheme(w.chart.background||'rgb(255,255,255)'),
				//'date_format'		: '%e %b',
				title : { text 		: w.chart.extras.header }
			},
			'data_options'			: [{ 'color' : w.chart.fill}],
			'widget_options': {
				'source' : 'ckan',
				'api' 	 : w.chart.api,
				'size_x' : w.size_x || 4,
				'size_y' : w.size_y || 8,
			}
		}
	}
	//// End of old widget handling
	return $.extend(true, widget_defaults, w)
}

CivicDashboards.prototype.add_widget			= function(w) {
	var dashboard = this;
	var widget_id = w.config.element_id.slice(1)
	var size_x 	  = (w.widget_options.size_x || 4)
	var size_y	  = (w.widget_options.size_y || 8)

	if($("#widget-" + widget_id).length == 0) {
		dashboard.gridstack.add_widget('<div id="widget-' + widget_id + '"><div class="grid-stack-item-content"></div></div>',0,0,size_x,size_y,true)
	}
	setTimeout(function(){ dashboard.create_widget(w) }, 100);
}

CivicDashboards.prototype.create_widget			= function(w) {
	var dashboard = this;

	var widget_id = w.config.element_id.slice(1);

	d3.select("#" + widget_id).remove()
	d3.select("#widget-" + widget_id + " .grid-stack-item-content")
		.append('div')
		.attr('id'			, widget_id)
		.classed('grid-stack-item-content',true)
		.style('background'	, w.config.theme.bg)
		.style('height', "100%")

	var add_action_buttons = function() {
		var action_buttons_container = d3.select("#widget-" + widget_id)
										.append('div')
										.attr('class','btn-group action-button-group')

		action_buttons_container.append('button').attr('type','button').attr('class','btn btn-xs')
						.html('<i class="fa fa-edit"></i>')

		action_buttons_container.append('button').attr('type','button').attr('class','btn btn-xs')
						.html('<i class="fa fa-trash"></i>')

		action_buttons_container.append('button').attr('type','button').attr('class','btn btn-xs')
						.html('<i class="fa fa-info"></i>')
	}
	add_action_buttons()




	new CivicWidgets(w.config, w.data, w.data_options, w.widget_options);
}

CivicDashboards.prototype.reload 				= function() {
	var dashboard = this;
	dashboard.widgets.forEach( function (w,i) {
		dashboard.add_widget(w)
	})
}
