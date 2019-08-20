from django.contrib import admin

# Register your models here.
from .models import Credentials, Person, TransactionTypeRef, TransactionAccessRef, BankApp


class PersonAdmin(admin.ModelAdmin):
    list_display = ('fname', 'lname', 'email', 'dateCreated', 'accountNumber')


class CredentialsAdmin(admin.ModelAdmin):
    list_display = ('username', 'password', 'personId')


class TransactionTypeRefAdmin(admin.ModelAdmin):
    list_display = ('transactionType', 'transactionDescription')


class TransactionAccessRefAdmin(admin.ModelAdmin):
    list_display = ('transactionAccess', 'transactionAccessDesc')


class BankAppAdmin(admin.ModelAdmin):
    list_display = ('userId', 'lastTransactionDate', 'transactionType', 'transactionAccess', 'transactionDescription', 'balance')


admin.site.register(Person, PersonAdmin)
admin.site.register(Credentials, CredentialsAdmin)
admin.site.register(TransactionTypeRef, TransactionTypeRefAdmin)
admin.site.register(TransactionAccessRef, TransactionAccessRefAdmin)
admin.site.register(BankApp, BankAppAdmin)
