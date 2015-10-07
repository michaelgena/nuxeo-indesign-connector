package org.nuxeo.indesignconnector.query;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.api.DocumentModelList;
import org.nuxeo.ecm.core.api.impl.DocumentModelListImpl;
import org.nuxeo.ecm.platform.query.nxql.CoreQueryDocumentPageProvider;

/**
 * Created by mgena on 15/09/2015.
 */
public class ChildrenPageProvider extends CoreQueryDocumentPageProvider {

    protected static final Log log = LogFactory.getLog(ChildrenPageProvider.class);

    private static final long serialVersionUID = 1L;

    protected List<DocumentModel> currentPageDocuments;
    
    protected int pageNumber;

    @Override
    public List<DocumentModel> getCurrentPage() {
    	
    	  DocumentModelList docs = (DocumentModelList) super.getCurrentPage();
          String where = "(";
          int count = docs.size();   
          if(count > 0){
        	  int i = 0;
              for(DocumentModel doc : docs) {
            	  where += "ecm:ancestorId = '" + doc.getId() + "'";
                  i += 1;
                  if(i < count) {
                	  where += " OR ";
                  }
              }
              where += ")";
        	  String finalNxql = "SELECT * FROM Document WHERE ecm:mixinType = 'Picture' AND " + where + " AND ecm:isVersion = 0 AND  ecm:currentLifeCycleState != 'deleted'";          
        	  return getCoreSession().query(finalNxql);
          }else{
        	  return new DocumentModelListImpl();
          }
       
    }
}
