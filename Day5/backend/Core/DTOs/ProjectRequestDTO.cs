using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BugTracker.Core.DTOs
{
public class ProjectRequestDTO
    {
      
        public required string Name { get; set; }

        public required string Description { get; set; }
    }
}
