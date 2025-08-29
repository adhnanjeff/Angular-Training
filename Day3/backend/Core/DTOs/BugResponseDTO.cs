namespace BugTracker.Core.DTOs
{
    public class BugResponseDTO
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string Status { get; set; } 
        public DateTime CreatedOn { get; set; }
        public int ProjectId { get; set; } 
    }
}
