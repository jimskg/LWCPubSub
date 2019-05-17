public with sharing class SaveOpps {
  @AuraEnabled(cacheable=true)
    public Static void saveUpdatedOpps(List<Opportunity> upOpps){
        System.debug('mesa stn new apex');
        update upOpps;
    }

}
