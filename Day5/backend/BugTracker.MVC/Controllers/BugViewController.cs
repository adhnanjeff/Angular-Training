using BugTracker.MVC.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

public class BugViewController : Controller
{
    private readonly HttpClient _httpClient;

    public BugViewController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient("BugTrackerAPI");
    }

    // GET: /BugView/
    public async Task<IActionResult> Index()
    {
        var bugs = await _httpClient.GetFromJsonAsync<List<BugViewModel>>("api/bug/async");

        if (bugs == null || !bugs.Any())
        {
            ViewBag.Message = "No bugs found!";
        }

        return View(bugs);
    }

    // GET: /BugView/Details/{id}
    public async Task<IActionResult> Details(int id)
    {
        var response = await _httpClient.GetAsync($"api/bug/async/{id}");
        if (!response.IsSuccessStatusCode)
        {
            return NotFound();
        }

        var json = await response.Content.ReadAsStringAsync();
        var bug = JsonSerializer.Deserialize<BugViewModel>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return View(bug);
    }
}
