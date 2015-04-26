from django.conf.urls import patterns
from aykutsimsek.apps.simseks.urls import urlpatterns as app_urlpatterns

urlpatterns = patterns('')
urlpatterns += app_urlpatterns

handler500 = 'census.views.server_error'