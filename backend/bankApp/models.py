from django.db import models


# Create your models here.
class Person(models.Model):
    fname = models.TextField()
    lname = models.TextField()
    email = models.EmailField()
    dateCreated = models.DateTimeField()
    accountNumber = models.CharField(max_length=32)

    def __str__(self):
        return self.email


class Credentials(models.Model):
    username = models.CharField(max_length=15)
    password = models.CharField(max_length=15)
    personId = models.OneToOneField(Person, on_delete=models.CASCADE, primary_key=True, unique=True)

    def __str__(self):
        return self.username


class TransactionTypeRef(models.Model):
    transactionType = models.TextField()
    transactionDescription = models.TextField()

    def __str__(self):
        return self.transactionType


class TransactionAccessRef(models.Model):
    transactionAccess = models.TextField()
    transactionAccessDesc = models.TextField()

    def __str__(self):
        return self.transactionAccess


class BankApp(models.Model):
    userId = models.ForeignKey(Credentials, on_delete=models.CASCADE)
    lastTransactionDate = models.DateTimeField()
    transactionType = models.ForeignKey(TransactionTypeRef, on_delete=models.CASCADE)
    transactionAccess = models.ForeignKey(TransactionAccessRef, on_delete=models.CASCADE)
    transactionDescription = models.CharField(max_length=150)
    balance = models.IntegerField()
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.userId
