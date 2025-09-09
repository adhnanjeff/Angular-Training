
namespace BugTracker.Core.DTOs
{
    public class ErrorResponseDTO
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
        public string CorrelationId { get; set; }
    }
}
