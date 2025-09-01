
function get_proportion(material){ //比重
   var proportion=0;
   if(material=="0"){ //鋁
   		proportion=2.85;
   }else if(material=="1"){//白鐵
   		proportion=7.87;
   }else if(material=="2"){//銅
   		proportion=8.5;
   }else if(material=="3"){//鐵
        proportion=7.87;
   }
   return proportion;
}

function get_volume_factor(shape){ //體積係數
   var volume_factor=0;
   if(shape=="0"){ //圓
   		volume_factor=0.7854;
   }else if(shape=="1"){ //八角
   		volume_factor=0.825;
   }else if(shape=="2"){ //六角
   		volume_factor=0.866;
   }
   return volume_factor;
}