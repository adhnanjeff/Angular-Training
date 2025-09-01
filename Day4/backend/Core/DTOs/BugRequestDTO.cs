namespace BugTracker.Core.DTOs
{
    public class BugRequestDTO
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string Status { get; set; } = "open";
        public int ProjectId { get; set; }
    }
}
