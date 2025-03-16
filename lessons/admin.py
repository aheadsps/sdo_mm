from django.contrib import admin
from lessons.models import Step
# Register your models here.

@admin.register(Step)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "serial",
        "title",
    )
    search_fields = (
        "title",
    )
