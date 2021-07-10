

$('#login').on('click',function(e)
{
    e.preventDefault();


      data={};
      data.username=$('#username').val();
      data.password=$('#password').val();
    
     console.log(data);
    fetch('/login', {
        method: 'POST', 
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        }
      
      }).then((res) => {if(res.status==200)
                         {
                          window.location.href ='/myDashBoard';
                         }                                                                        
      })
      .catch((e)=>{console.log(e);})
    
})