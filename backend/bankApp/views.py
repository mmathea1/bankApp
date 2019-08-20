# Create your views here.
from rest_framework import viewsets

from .models import Credentials, Person, TransactionTypeRef, TransactionAccessRef, BankApp
from .serializers import CredentialsSerializer, PersonSerializer, TransactionTypeRefSerializer, \
    TransactionAccessRefSerializer, BankAppSerializer


class PersonView(viewsets.ModelViewSet):
    serializer_class = PersonSerializer
    queryset = Person.objects.all()


class CredentialsView(viewsets.ModelViewSet):
    serializer_class = CredentialsSerializer
    queryset = Credentials.objects.all()


class TransactionTypeRefView(viewsets.ModelViewSet):
    serializer_class = TransactionTypeRefSerializer
    queryset = TransactionTypeRef.objects.all()


class TransactionAccessRefView(viewsets.ModelViewSet):
    serializer_class = TransactionAccessRefSerializer
    queryset = TransactionAccessRef.objects.all()


class BankAppView(viewsets.ModelViewSet):
    serializer_class = BankAppSerializer
    queryset = BankApp.objects.all()
