namespace BugTracker.Core.Entities
{
    public class Bug
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Status { get; set; }
        public required string Priority { get; set; }
        public DateTime CreatedOn { get; set; }
        public int ProjectId { get; set; }
        public Project? Project { get; set; } 
    }
}
