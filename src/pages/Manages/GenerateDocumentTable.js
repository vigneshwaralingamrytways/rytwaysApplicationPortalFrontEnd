import * as FaIcons from "react-icons/fa";

const GenerateDocumentTable = (fields,handleGenerate,selectedDocument) => {

  const dynamicCols = fields.map((field, index) => ({
    title: field.feildName,   
    align: "center",
    render: () => <span>{field.feildValue}</span>,
  }));

  return [
    ...dynamicCols,

   
    {
      title: "Action",
      align: "center",
      render: () => (
        <>
          <span style={{ cursor: "pointer", color: "green", marginRight: 10 }}
          onClick={()=>handleGenerate(selectedDocument)}>
            <FaIcons.FaEye />
          </span>
          {/* <span style={{ cursor: "pointer", color: "blue" }}>
            <FaIcons.FaDownload />
          </span> */}
        </>
      ),
    },
  ];
};

export default GenerateDocumentTable;