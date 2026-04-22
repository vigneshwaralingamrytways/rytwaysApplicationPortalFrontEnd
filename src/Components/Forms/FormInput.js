export const form=[{
    title: "Shift",
    type: "select",
    name: "shift",
    validationProps: "Please select Shift",
    contains: "Select",
    options: [
      { value: "", label: "Select" },
      { value: "Shift_A", label: "Shift A" },
      { value: "Shift_B", label: "Shift B" },
      { value: "Shift_C", label: "Shift C" },
    ],
  },
  {
    title: 'Remarks',
    type: 'textarea',
    name: 'remarks',
    contains:"textarea",
    inpprops:{
      maxlength:128,
      md:6
    },
     },, {
        title: "Mobile No",
        type: "text",
        name: "orderNo",
        contains: "text",
        inpprops: {
          
        },
      }, {
        title: "Gst No",
        type: "text",
        name: "orderNo",
        contains: "text",
        inpprops: {
          
        },
      },
      {
        title: 'Address',
        type: 'textarea',
        name: 'remarks',
        contains:"textarea",
        inpprops:{
          maxlength:128,
          md:4
        },
         },
         {
          title: "Country",
          type: "select",
          name: "Department",
          validationProps: "Please select Shift",
          contains: "Select",
          options: [
            { value: "", label: "Select" },
            { value: "India", label: "India" },
          ],
        },
        {
          title: "State Name",
          type: "select",
          name: "Department",
          validationProps: "Please select Shift",
          contains: "Select",
          options: [
            { value: "", label: "Select" },
            { value: "India", label: "Tamil Nadu" },
          ],
        }, {
            title: "Vendor No",
            type: "text",
            name: "orderNo",
            contains: "text",
            inpprops: {
              
            },
          }, {
            title: "Vendor Gst",
            type: "text",
            name: "orderNo",
            contains: "text",
            inpprops: {
              
            },
          }, {
            title: 'Billing Address',
            type: 'textarea',
            name: 'remarks',
            contains:"textarea",
            inpprops:{
              maxlength:128,
              md:4
            },
             },
          {
            title: "Vendor Country",
            type: "select",
            name: "Department",
            validationProps: "Please select Shift",
            contains: "Select",
            options: [
              { value: "", label: "Select" },
              { value: "India", label: "India" },
            ],
          },
          {
            title: "Vendor State",
            type: "select",
            name: "Department",
            validationProps: "Please select Shift",
            contains: "Select",
            options: [
              { value: "", label: "Select" },
              { value: "India", label: "Tamil Nadu" },
            ],
          },
]


