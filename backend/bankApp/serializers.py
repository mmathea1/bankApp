from rest_framework import serializers

from .models import Credentials, Person, TransactionTypeRef, TransactionAccessRef, BankApp


class BankAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankApp
        fields = (
                  'userId',
                  'lastTransactionDate',
                  'transactionType',
                  'transactionAccess',
                  'transactionDescription',
                  'balance')


class CredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credentials
        fields = ('username', 'password', 'personId')


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('fname', 'lname', 'email', 'dateCreated', 'accountNumber')


class TransactionTypeRefSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionTypeRef
        fields = ('transactionType', 'transactionDescription')


class TransactionAccessRefSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionAccessRef
        fields = ('transactionAccess', 'transactionAccessDesc')
















































































































































