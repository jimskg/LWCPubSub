public with sharing class FindAccCont {
    @AuraEnabled(cacheable=true)
    public Static List<Account> findAccAndContacts(String searchAccount){
        List<Account> accRetrieved = new List<Account>();
        String key = '%' + searchAccount + '%';
        accRetrieved = [SELECT Id, name, Last_name__c, Mobile_phone__c, Email__c FROM Account WHERE name LIKE :key ];
        return accRetrieved;
    }

}