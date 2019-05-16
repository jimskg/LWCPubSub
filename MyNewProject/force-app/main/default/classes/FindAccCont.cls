public with sharing class FindAccCont {
    @AuraEnabled(cacheable=true)
    public Static List<Account> findAccAndContacts(String searchAccount){
        List<Account> accRetrieved = new List<Account>();
        String key = '%' + searchAccount + '%';
        accRetrieved = [SELECT id, name FROM Account WHERE name LIKE :key ];
        return accRetrieved;
        //return searchAccount;
    }

}