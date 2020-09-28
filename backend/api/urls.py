from rest_framework import routers
from .views import TaskViewset


router = routers.DefaultRouter()
router.register("api/tasks", TaskViewset, "tasks")

urlpatterns = router.urls
