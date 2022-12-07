module.exports = {
    IpAddess: new RegExp(
      /^\[(("\d(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])")(,"\d(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])")*)?\]$/
    ),
    Alphabetical: /^[A-Za-záéíóúÁÉÍÓÚÄÖÜüöÀàÂâĞğÇçÔôŒœÈèÊêËëÆæÙùÛûŸÿ]+$/,
    AlphabeticalSpace: /^[A-Za-záéíóúÁÉÍÓÚÄÖÜüöÀàÂâĞğÇçÔôŒœÈèÊêËëÆæÙùÛûŸÿ ]+$/,
    MongoID: /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
    MongoIDArray: /\[([a-f\d,]+[a-f\d])*\]/,
    Picture: /[\/.](jpg|jpeg|png)$/i,
    TrueFalse: /^(?:tru|fals)e$/,
    NumberFormat: /^(?:percentage|currency|number)$/,
    LeadShare: /^(?:L|O|S)$/,
    Region: /^(?:NA|EMEA|ASPAC|LATAM|Not Applicable)$/,
    CriticalityLevels: /^(?:CL1|CL2|CL3|CL4)$/,
    DataType:
      /^(?:materials|catalogue|person|people|date|dates|options|addOptions|formula|condition|decimal|integer|country|state|city|positive decimal|negative decimal|year|min-max decimal|positive integer|negative integer|min-max integer|alphabetical|alphanumerical|max length|min length|min-max length|boolean|anything)$/,
    AuditActivity: /^(?:0|1|1x|2|3)$/,
    Email:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    Integer: /^[0-9]*[1-9][0-9]*$/,
    JSONString: /[{\[]{1}([,:{ }\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/,
    DDMMYYYY:
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    YYYYMMDD:
      /^(((\d{4}-((0[13578]-|1[02]-)(0[1-9]|[12]\d|3[01])|(0[13456789]-|1[012]-)(0[1-9]|[12]\d|30)|02-(0[1-9]|1\d|2[0-8])))|((([02468][048]|[13579][26])00|\d{2}([13579][26]|0[48]|[2468][048])))-02-29)){0, 10}$/,
    YYYYMMDDTHHMMSSZ: /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/,
    HEXCOLOR: /^#([0-9a-f]{3}){1, 2}$/,
    LongString: /^[A-Za-záéíóúÁÉÍÓÚÄÖÜüöÀàÂâĞğÇçÔôŒœÈèÊêËëÆæÙùÛûŸÿ0123456789 ]+$/,
    ISO3: /^[a-zA-Z]{3}$/,
    StringArray:
      /^([\["]+[A-Za-záéíóúÁÉÍÓÚÄÖÜüöÀàÂâĞğÇçÔôŒœÈèÊêËëÆæÙùÛûŸÿ0123456789 ]+["]+(?:,["]+[A-Za-záéíóúÁÉÍÓÚÄÖÜüöÀàÂâĞğÇçÔôŒœÈèÊêËëÆæÙùÛûŸÿ0123456789 ]+["])+[\]])$/,
    LongDecimal: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/,
  };
  