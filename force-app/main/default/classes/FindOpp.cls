public with sharing class FindOpp {
    @AuraEnabled(cacheable=true)
    public Static List<Opportunity> searchOpps(Id searchOppByAcc){
        
        Account acc = [SELECT Id FROM account WHERE Id =: searchOppByAcc];
        List<Opportunity> oppRetrieved = [SELECT Id, Name, StageName, Probability, Amount FROM opportunity WHERE AccountId=:acc.Id];

        return oppRetrieved;
    }
}
