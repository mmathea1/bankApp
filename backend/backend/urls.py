"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

# from bankApp import views
from bankApp import views

router = routers.DefaultRouter()
router.register(r'bankApp', views.BankAppView, 'bankApp')
router.register(r'credentials', views.CredentialsView, 'credentials')
router.register(r'person', views.PersonView, 'person')
router.register(r'transactionType', views.TransactionTypeRefView, 'transactionType')
router.register(r'transactionAccess', views.TransactionAccessRefView, 'transactionAccess')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]
