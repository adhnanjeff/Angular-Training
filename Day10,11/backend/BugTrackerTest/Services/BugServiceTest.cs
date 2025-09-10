using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using BugTracker.Core.Entities;
using BugTracker.Core.Interfaces;
using BugTracker.Core.Services;
using BugTracker.Core.DTOs;

namespace BugTrackerTest.Services
{
    public class BugServiceTests
    {
        [Fact]
        public void CreateBug_WithValidDTO_CreatesSuccessfully()
        {
            // Arrange
            var request = new BugRequestDTO
            {
                Title = "New Bug",
                Description = "New bug description",
                Status = "open",
                ProjectId = 201
            };

            var mockRepo = new Mock<IBugRepository>();
            mockRepo.Setup(repo => repo.Add(It.IsAny<Bug>()));

            var service = new BugService(mockRepo.Object);

            // Act
            service.CreateBug(request);

            // Assert
            mockRepo.Verify(repo => repo.Add(It.Is<Bug>(b =>
                b.Title == request.Title &&
                b.Description == request.Description &&
                b.Status == request.Status &&
                b.ProjectId == request.ProjectId
            )), Times.Once);
        }

        [Fact]
        public void GetBugById_WithInvalidId_ReturnsNull()
        {
            // Arrange
            int invalidId = 999;
            var mockRepo = new Mock<IBugRepository>();
            mockRepo.Setup(repo => repo.GetById(invalidId)).Returns((Bug?)null);

            var service = new BugService(mockRepo.Object);

            // Act
            var result = service.GetBugById(invalidId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetBugById_WithValidId_ReturnsBug()
        {
            // Arrange
            int existingId = 1;

            var existingBug = new Bug
            {
                Id = existingId,
                Title = "Bug 1",
                Description = "Description 1",
                Status = "open",
                CreatedOn = DateTime.UtcNow,
                ProjectId = 101
            };

            var mockRepo = new Mock<IBugRepository>();
            mockRepo.Setup(repo => repo.GetById(existingId)).Returns(existingBug);

            var service = new BugService(mockRepo.Object);

            // Act
            var result = service.GetBugById(existingId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Bug 1", result.Title);
            Assert.Equal("Description 1", result.Description);
            Assert.Equal("open", result.Status);
        }

        [Fact]
        public void UpdateBug_WithExistingBug_UpdatesSuccessfully()
        {
            // Arrange
            int existingId = 1;

            var existingBug = new Bug
            {
                Id = existingId,
                Title = "Old Title",
                Description = "Old Description",
                Status = "open",
                CreatedOn = DateTime.UtcNow,
                ProjectId = 301
            };

            var updateDto = new BugRequestDTO
            {
                Title = "Updated Title",
                Description = "Updated Description",
                Status = "closed",
                ProjectId = 301
            };

            var mockRepo = new Mock<IBugRepository>();
            mockRepo.Setup(repo => repo.GetById(existingId)).Returns(existingBug);
            mockRepo.Setup(repo => repo.Update(It.IsAny<Bug>()));

            var service = new BugService(mockRepo.Object);

            // Act
            service.UpdateBug(existingId, updateDto);

            // Assert
            mockRepo.Verify(repo => repo.Update(It.Is<Bug>(b =>
                b.Id == existingId &&
                b.Title == updateDto.Title &&
                b.Description == updateDto.Description &&
                b.Status == updateDto.Status
            )), Times.Once);
        }

        [Fact]
        public void GetAllBugs_ReturnsCorrectData()
        {
            // Arrange
            var fakeBugs = new List<Bug>
            {
                new Bug { Id = 1, Title = "UI Bug", Description = "App is not responsive", Status = "open", CreatedOn = DateTime.UtcNow, ProjectId = 101 },
                new Bug { Id = 2, Title = "VPN Bug", Description = "VPN disconnects often", Status = "closed", CreatedOn = DateTime.UtcNow, ProjectId = 102 }
            };

            var mockRepo = new Mock<IBugRepository>();
            mockRepo.Setup(repo => repo.GetAll()).Returns(fakeBugs);

            var bugService = new BugService(mockRepo.Object);

            // Act
            var result = bugService.GetAllBugs().ToList();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("Bug 1", result[0].Title);
            Assert.Equal("Bug 2", result[1].Title);
        }
    }
}
