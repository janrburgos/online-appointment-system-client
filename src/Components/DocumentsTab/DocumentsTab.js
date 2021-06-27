import "./DocumentTab.css";
import { useSelector } from "react-redux";

const DocumentsTab = () => {
  const documents = useSelector((state) => state.documentsReducer.documents);

  return (
    <section className="DocumentsTab">
      <p className="inner-header">documents tab</p>
      {documents.length === 0 && (
        <div className="empty-tab">no documents uploaded...</div>
      )}
      <div className="documents-grid">
        {documents.map((document) => (
          <div
            key={`documents-grid-${document.documentUrl}`}
            className="document-box"
          >
            <p>{document.docType}</p>
            <img src={document.documentUrl} alt="document" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DocumentsTab;
