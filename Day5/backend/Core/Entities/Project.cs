using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Core.Entities
{
 public  class Project
    {
        public int Id { get; set; }
        public required  string Name { get; set; }
        
        public required string  Description{get;set;}
        public ICollection<Bug> Bugs { get; set; } = new List<Bug>();
    }
}
