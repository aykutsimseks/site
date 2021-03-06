from django.conf.urls import url, patterns, include
from django.contrib import admin
from django.core.urlresolvers import reverse_lazy
from django.views.decorators.cache import cache_page
from django.views.generic.base import TemplateView, RedirectView

from .views import *

admin.autodiscover()
STANDARD_CACHE_TIME = 60*60 # 60-minute cache

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^/?$', TemplateView.as_view(template_name='index.html'), name="homepage"),
    url(r'^(project/)?world-bank-indicators/?$', TemplateView.as_view(template_name='world_bank_indicators/world_bank_indicators.html'), name="world_bank_indicators"),
    url(r'^(project/)?aid-indicators/?$', TemplateView.as_view(template_name='aid_indicators/aid_indicators.html'), name="aid_indicators"),
    url(r'^(project/)?altug-firarda/?(\?l=(?P<language>\w+))?$', TemplateView.as_view(template_name='altug_firarda/altug_firarda.html'), name="altug_firarda"),
    url(r'^(project/)?moviera/?$', TemplateView.as_view(template_name='moviera/moviera.html'), name="moviera"),
    
    
    url('', include('social.apps.django_app.urls', namespace='social')),
    url('', include('django.contrib.auth.urls', namespace='auth')),
)
